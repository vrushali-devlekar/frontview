// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { registerUser, authSuccess, logout, oauthSuccess } = require('../controllers/authController');

// Validation middleware generator
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const router = express.Router();

// ==========================================
// 1. LOCAL ROUTES (Email & Password)
// ==========================================
router.post('/register', registerValidation, registerUser);

// Sahi tareeka: Ek hi baar route define karna hai
router.post('/login',
    loginValidation,
    passport.authenticate('local', { session: false }),
    authSuccess
);

// ==========================================
// 2. GITHUB ROUTES
// ==========================================
// User browser se yahan aayega -> GitHub ka page khulega
router.get('/github',
    passport.authenticate('github', { scope: ['user:email', 'repo'] })
);

// GitHub login ke baad yahan wapas bhejega
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/auth/login-failed' }),
    oauthSuccess // 🌟 YAHAN CHANGE KIYA
);

// ==========================================
// 3. GOOGLE ROUTES
// ==========================================
// User browser se yahan aayega -> Google ka page khulega
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google login ke baad yahan wapas bhejega
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
    oauthSuccess // 🌟 YAHAN BHI CHANGE KIYA
);

// ==========================================
// 4. COMMON ROUTES
// ==========================================
router.get('/logout', logout);

// Failure route agar kisi karan se login fail ho jaye
router.get('/login-failed', (req, res) => {
    res.status(401).json({ success: false, message: 'OAuth Authentication Failed' });
});

module.exports = router;