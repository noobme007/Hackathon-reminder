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
console.log('🔍 Checking Google Env Vars:', {
    hasID: !!process.env.GOOGLE_CLIENT_ID,
    hasSecret: !!process.env.GOOGLE_CLIENT_SECRET
});
require('./config/passport')(passport);

// 1. HEALTH CHECK (MUST BE FIRST)
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.status(200).send('API is Live'));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Less restrictive for easier connection
}));
app.use(express.json());

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

// Sessions
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true, // Required for secure cookies on Render
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Needed for cross-domain cookies
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
const allowedOrigins = [
    'https://hackathon-reminder.vercel.app',
    'https://reminder.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // Or if the origin matches our allowed list or is a vercel subdomain
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('🚫 CORS Refused Origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully');
        // Start Cron Job only after DB is ready
        // startCron();
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
