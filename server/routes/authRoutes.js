const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
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

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to frontend root
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/`);
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
