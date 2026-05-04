const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

require('./config/passportSetup');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');
const envRoutes = require('./routes/envRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const teamRoutes = require('./routes/teamRoutes');
const aiRoutes = require('./routes/aiRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const { proxyLiveDeployment } = require('./controllers/liveController');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { analyzeLogsWithAI } = require('./services/logAnalysisService');
const {
  isAllowedOrigin,
  isProduction,
  sessionCookieSameSite,
  sessionCookieSecure,
} = require('./config/runtime');

const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(compression());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Keep CORS before limiters/auth/session so preflight always gets headers.
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 800 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message:
    'Too many API requests from this IP, please try again after 15 minutes',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 50 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: (req) => req.method === 'OPTIONS',
  message:
    'Too many authentication attempts from this IP, please try again after 15 minutes',
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  proxy: isProduction,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: sessionCookieSecure,
    httpOnly: true,
    sameSite: sessionCookieSameSite,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/projects', envRoutes);
app.use('/api/projects/:projectId/integrations', integrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workspace', workspaceRoutes);

app.all('/live/:id', proxyLiveDeployment);
app.all('/live/:id/*splat', proxyLiveDeployment);

app.get('/api/health', (req, res) => {
  res.send('DeployPilot API is running perfectly!');
});

app.post('/api/test-ai', async (req, res) => {
  try {
    const { logs, provider = 'mistral' } = req.body;
    if (!logs) {
      return res
        .status(400)
        .json({ error: 'Logs array is required for testing' });
    }
    const aiResponse = await analyzeLogsWithAI(logs, provider);
    return res.status(200).json({ success: true, aiAnalysis: aiResponse });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const frontendDistPath = path.resolve(__dirname, '../dist');
app.use(express.static(frontendDistPath));
app.get(/^\/(?!api|live).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
