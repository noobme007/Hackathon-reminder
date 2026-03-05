const express = require('express');
const router = express.Router();
const { register, login, generateToken } = require('../controllers/authController');
const passport = require('passport');

router.post('/signup', register);
router.post('/login', login);

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
    accessType: 'offline',
    prompt: 'consent'
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        // Dynamically determine the client URL: use the origin that referred the request if possible
        const origin = req.get('origin') || req.get('referer');
        let clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // If the request came from a known trusted domain but CLIENT_URL is different, 
        // we should try to stay on that domain.
        if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
            // Remove path from referer if present
            clientUrl = new URL(origin).origin;
        }

        const token = generateToken(req.user._id);
        res.redirect(`${clientUrl}/?token=${token}&id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${req.user.email}`);
    }
);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router;
