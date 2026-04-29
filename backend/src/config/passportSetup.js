// config/passportSetup.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// User ki ID ko session mein pack karna
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Session se ID nikal kar poora User fetch karna
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ==========================================
// 1. LOCAL STRATEGY (Email & Password)
// ==========================================
passport.use(new LocalStrategy({ usernameField: 'email' }, 
    async (email, password, done) => {
        try {
            // Email se user dhundo
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });
            }
            
            // Agar user Google/GitHub wala hai aur password daal raha hai
            if (!user.password) {
                return done(null, false, { message: 'Please login using your OAuth provider (Google/GitHub)' });
            }

            // Password match karo (User model ka method use karke)
            const isMatch = await user.matchPassword(password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

// ==========================================
// 2. GITHUB STRATEGY
// ==========================================
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 
            ? profile.emails[0].value 
            : `${profile.username}@github.com`;
            
        const avatarUrl = profile.photos && profile.photos.length > 0 
            ? profile.photos[0].value 
            : '';

        let user = await User.findOne({ email });
        
        // Agar user pehle se hai, toh sirf uska naya accessToken update kar do
        if (user) {
            user.githubAccessToken = accessToken; 
            await user.save();
            return done(null, user);
        }

        // Agar naya user ban raha hai, toh create karte waqt accessToken daalo
        user = await User.create({
            username: profile.username || profile.displayName,
            email: email,
            githubId: profile.id,
            avatarUrl: avatarUrl,
            authProvider: 'github',
            githubAccessToken: accessToken 
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ==========================================
// 3. GOOGLE STRATEGY
// ==========================================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 
            ? profile.emails[0].value 
            : `${profile.id}@google.com`;
            
        const avatarUrl = profile.photos && profile.photos.length > 0 
            ? profile.photos[0].value 
            : '';

        let user = await User.findOne({ email });
        if (user) return done(null, user);

        user = await User.create({
            username: profile.displayName,
            email: email,
            googleId: profile.id,
            avatarUrl: avatarUrl,
            authProvider: 'google'
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));