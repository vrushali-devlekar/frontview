// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

const readCookieToken = (req) => {
    const fromCookieParser = req.cookies && req.cookies.token;
    if (fromCookieParser) return fromCookieParser;

    const rawCookieHeader = req.headers?.cookie || '';
    const matched = rawCookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (!matched) return null;

    try {
        return decodeURIComponent(matched[1]);
    } catch {
        return matched[1];
    }
};

// Ye humara "Bouncer" function hai
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check karo ki Header mein Authorization hai aur wo 'Bearer' se start ho raha hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback: Cookie based auth
    if (!token) {
        token = readCookieToken(req);
    }

    // Agar token hi nahi mila
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

module.exports = { protect };