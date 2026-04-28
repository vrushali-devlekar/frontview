// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const { registerUser, authSuccess, logout } = require('../controllers/authController');

const router = express.Router();

// ==========================================
// 1. LOCAL ROUTES (Email & Password)
// ==========================================
router.post('/register', registerUser);

// Local login ke liye hum 'local' bouncer use kar rahe hain
router.post('/login', 
   router.post('/login', passport.authenticate('local', { session: false }), authSuccess) // JWT use kar rahe hain toh session ki zaroorat nahi local ke liye
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
    authSuccess // Agar success hua toh ye function JWT bhej dega
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
    authSuccess
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