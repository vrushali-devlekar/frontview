// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session'); 
const passport = require('passport');
require('./config/passportSetup');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { protect } = require('./middlewares/authMiddleware');

// Express app initialize karna
const app = express();

// --- MIDDLEWARES ---

// 1. Session sabse pehle aayega
app.use(session({
    secret: process.env.SESSION_SECRET || 'mera_super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// 2. Passport initialize hoga session ke BAAD
app.use(passport.initialize());
app.use(passport.session());

// 3. CORS
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// 4. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Routes
app.use('/api/auth' , authRoutes);
app.use('/api/projects', projectRoutes);

// --- BASIC ROUTE ---
app.get('/', (req, res) => {
    res.send('DeployPilot API is running perfectly!');
});

module.exports = app;