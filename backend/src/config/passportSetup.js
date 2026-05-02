// config/passportSetup.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

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

// GitHub often omits `profile.emails` (private email / API shape). Never index [0] blindly.
function resolveGithubEmail(profile) {
    const primary = profile.emails?.find((e) => e.primary)?.value;
    const first = profile.emails?.[0]?.value;
    const jsonEmail = profile._json?.email;
    if (primary || first || jsonEmail) {
        return primary || first || jsonEmail;
    }
    const id = profile.id;
    const username = profile.username;
    if (id && username) {
        return `${id}+${username}@users.noreply.github.com`;
    }
    return null;
}

function resolveGithubAvatar(profile) {
    return profile.photos?.[0]?.value || profile._json?.avatar_url || undefined;
}

// ==========================================
// 2. GITHUB STRATEGY
// ==========================================
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = resolveGithubEmail(profile);
        if (!email) {
            return done(null, false, { message: 'GitHub did not provide an email. Allow email access or set a public email on GitHub.' });
        }

        const githubId = String(profile.id);
        let user = await User.findOne({ githubId });
        if (!user) {
            user = await User.findOne({ email });
        }

        if (user) {
            user.githubAccessToken = accessToken;
            if (!user.githubId) {
                user.githubId = githubId;
            }
            await user.save();
            return done(null, user);
        }

        const avatarUrl = resolveGithubAvatar(profile);

        user = await User.create({
            username: profile.username || profile.displayName || `github-${profile.id}`,
            email,
            githubId,
            ...(avatarUrl ? { avatarUrl } : {}),
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
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) return done(null, user);

        user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatarUrl: profile.photos[0].value,
            authProvider: 'google'
        });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));