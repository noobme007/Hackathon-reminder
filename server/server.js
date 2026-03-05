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
const passport = require('passport');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);

// 1. HEALTH CHECK (MUST BE FIRST)
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('API is Live'));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Less restrictive for easier connection
}));
app.use(express.json());

// Sessions
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

        // 🚀 STARTUP NOTIFICATION TEST
        if (process.env.DISCORD_WEBHOOK_URL) {
            console.log('📬 Triggering startup notification test...');
            sendEmail({
                to: 'System Admin',
                subject: '🚀 System Online: Hackathon Reminder',
                text: 'Hii! Your server is live on Render. All notifications are now routed to Discord with Google Calendar integration!'
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
