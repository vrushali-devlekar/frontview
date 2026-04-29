// app.js
import express from 'express';
import cors from 'cors';
import session from 'express-session'; 
import passport from 'passport';
import './config/passportSetup.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { protect } from './middlewares/authMiddleware.js';
import deploymentRoutes from './routes/deploymentRoutes.js';

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
app.use('/api/deployments', deploymentRoutes);

// --- BASIC ROUTE ---
app.get('/', (req, res) => {
    res.send('DeployPilot API is running perfectly!');
});

export default app;