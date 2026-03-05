const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const startCron = require('./cron/reminderCron');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. HEALTH CHECK (MUST BE FIRST)
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('API is Live'));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Less restrictive for easier connection
}));
app.use(express.json());

// Trust Proxy (Required for Railway/Render/Vercel)
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Config for Production
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);

const { sendEmail } = require('./utils/email');

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully');
        // Start Cron Job only after DB is ready
        startCron();

        // 🚀 STARTUP TEST EMAIL (Hardcoded)
        if (process.env.EMAIL_USER) {
            console.log('📬 Triggering startup test email to verify Gmail...');
            sendEmail({
                to: process.env.EMAIL_USER, // Send to yourself
                subject: '🚀 Startup Test: Hackathon Reminder',
                text: 'Hii! This is a hardcoded test to verify your Gmail connection on Render. Your server is live and ready!'
            });
        }
    })
    .catch((err) => {
        console.error('MongoDB Connection Failed:', err);
    });

// Start Server immediately
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready on port ${PORT}`);
});

// Avoid timeout issues
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
