// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session'); 
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config/passportSetup');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { protect } = require('./middlewares/authMiddleware');
const deploymentRoutes = require('./routes/deploymentRoutes');
const envRoutes = require('./routes/envRoutes');

// Express app initialize karna
const app = express();

// --- MIDDLEWARES ---

// 1. Helmet for Security Headers
app.use(helmet());

// 2. Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(globalLimiter);

// 3. Session sabse pehle aayega
app.use(session({
    secret: process.env.SESSION_SECRET || 'mera_super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict'
    } 
}));

// 4. Passport initialize hoga session ke BAAD
app.use(passport.initialize());
app.use(passport.session());

// 5. CORS
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// 6. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Routes
app.use('/api/auth' , authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/projects', envRoutes);

// --- BASIC ROUTE ---
app.get('/', (req, res) => {
    res.send('DeployPilot API is running perfectly!');
});

module.exports = app;