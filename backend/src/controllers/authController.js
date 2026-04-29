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
    res.cookie('token',generateToken(req.user._id))
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