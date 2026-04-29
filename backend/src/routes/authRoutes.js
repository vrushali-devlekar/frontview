// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { registerUser, authSuccess, logout } from '../controllers/authController.js';

const router = express.Router();

/// ==========================================
// 1. LOCAL ROUTES (Email & Password)
// ==========================================   
router.post('/register', registerUser);

// Sahi tareeka: Ek hi baar route define karna hai
router.post('/login', 
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

export default router;