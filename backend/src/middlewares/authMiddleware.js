// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.js';

// Ye humara "Bouncer" function hai
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check karo ki Header mein Authorization hai aur wo 'Bearer' se start ho raha hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Header format: "Bearer <token>" hota hai, isliye split karke sirf token nikal rahe hain
            token = req.headers.authorization.split(' ')[1];

            // 2. Token ko verify karo (secret key ka use karke)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Token se User ID nikal kar database se user fetch karo
            // Password ko hatane ke liye .select('-password') use kiya hai (Security!)
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Sab sahi hai, toh aage badhne do (next middleware/controller pe)
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    console.log("Received Headers:", req.headers);
    // Agar token hi nahi mila
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});
