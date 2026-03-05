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
        // Successful authentication, redirect to frontend root with token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const token = generateToken(req.user._id);
        // We append the token and basic user info to the URL as a fallback for mobile Safari/private mode
        // which often blocks the cross-domain session cookie
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
