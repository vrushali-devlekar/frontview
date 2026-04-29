// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewares/asyncHandler.js';

// Helper Function: JWT Token Generate karna
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// 1. LOCAL REGISTER (Naya Account Banana)
// ==========================================
export const registerUser = asyncHandler(async (req, res) => {
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

      res.cookie('token',generateToken(user._id))

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// ==========================================
// 2. OAUTH & LOCAL SUCCESS CALLBACK
// ==========================================
// Ye function Google, GitHub aur Local Login teeno ke success hone par chalega
export const authSuccess = (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Authentication Failed');
    }

    const token = generateToken(req.user._id);

    // If local auth, return JSON. If OAuth (github/google), redirect to frontend
    if (req.user.authProvider === 'local') {
        res.status(200).json({
            success: true,
            message: `Logged in successfully via ${req.user.authProvider}`,
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.avatarUrl
            },
            token: token
        });
    } else {
        // Redirect to frontend dashboard with token in URL query
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
};

// ==========================================
// 3. LOGOUT
// ==========================================
export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(500);
            throw new Error('Logout error');
        }
        req.session.destroy();
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
};