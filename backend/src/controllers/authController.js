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
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(201).json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email },
            token,
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
    const token = generateToken(req.user._id);
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    const redirect = req.session?.oauthRedirect;
    if (redirect) {
        req.session.oauthRedirect = null;
        return res.redirect(redirect);
    }

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
        token // Backend ticket (also stored as httpOnly cookie)
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