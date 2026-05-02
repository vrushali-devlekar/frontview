// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');

// Helper Function: JWT Token Generate karna
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// 1. LOCAL REGISTER (Naya Account Banana)
// ==========================================
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        username,
        email,
        password,
        authProvider: 'local' // Set provider as local
    });

    if (user) {
        res.status(201).json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email },
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// ==========================================
// 2. OAUTH & LOCAL SUCCESS CALLBACK
// ==========================================
// Ye function Google, GitHub aur Local Login teeno ke success hone par chalega
exports.authSuccess = (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Authentication Failed');
    }
    res.cookie('token', generateToken(req.user._id))
    // Passport ne user ko verify kar diya hai, ab hum apna JWT token bhejenge
    res.status(200).json({
        success: true,
        message: `Logged in successfully via ${req.user.authProvider}`,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatarUrl
        },
        token: generateToken(req.user._id) // Backend ticket
    });
};

// ==========================================
// 2.5 OAUTH SPECIFIC SUCCESS CALLBACK (For Github/Google)
// ==========================================
exports.oauthSuccess = (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!req.user) {
        // Agar fail ho jaye toh frontend ke login page par error ke sath bhejo
        return res.redirect(`${frontendUrl}/login?error=AuthenticationFailed`);
    }

    // Token generate karo
    const token = generateToken(req.user._id);

    // 🌟 PROFESSIONAL SDE FIX: JSON dikhane ki jagah seedha React App par redirect maaro 
    // Token ko URL me pass kar rahe hain taaki React use catch kar sake
    res.redirect(`${frontendUrl}/auth/success?token=${token}`);
};

// ==========================================
// 3. LOGOUT
// ==========================================
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500);
            throw new Error('Logout error');
        }
        req.session.destroy();
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
};

// ==========================================
// 4. GET CURRENT USER
// ==========================================
exports.getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatarUrl
        }
    });
});

// ==========================================
// 5. UPDATE CURRENT USER
// ==========================================
exports.updateMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const { username, email, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (typeof username === 'string' && username.trim()) {
        user.username = username.trim();
    }

    if (typeof email === 'string' && email.trim()) {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
        if (existing) {
            res.status(400);
            throw new Error('Email already in use');
        }
        user.email = normalizedEmail;
    }

    if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
        user.avatarUrl = avatarUrl.trim();
    }

    const updated = await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
            id: updated._id,
            username: updated.username,
            email: updated.email,
            avatar: updated.avatarUrl
        }
    });
});