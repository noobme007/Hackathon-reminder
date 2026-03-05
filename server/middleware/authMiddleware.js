const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Check for Passport/Google Session (New Way)
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // 2. Fallback to JWT Token (Old Way)
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied, please login' });
    }

    try {
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Session expired, please login again' });
    }
};

module.exports = authMiddleware;
