// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("./config/passportSetup");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const { protect } = require("./middlewares/authMiddleware");
const deploymentRoutes = require("./routes/deploymentRoutes");
const envRoutes = require("./routes/envRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Express app initialize karna
const app = express();

// --- MIDDLEWARES ---

// 1. Helmet for Security Headers
app.use(helmet());

// 2. Global Rate Limiting
// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again after 15 minutes'
// });
// app.use(globalLimiter);

// 3. Session sabse pehle aayega
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mera_super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  }),
);

// 4. Passport initialize hoga session ke BAAD
app.use(passport.initialize());
app.use(passport.session());

// 5. CORS
// Allow local dev ports (Vite may switch 5173 -> 5174 when busy)
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server/no-origin requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// 6. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deployments", deploymentRoutes);
app.use("/api/projects", envRoutes);
app.use("/api/projects/:projectId/integrations", integrationRoutes);
app.use("/api/ai", aiRoutes);

// --- BASIC ROUTE ---
app.get("/api/health", (req, res) => {
  res.send("DeployPilot API is running perfectly!");
});

const { analyzeLogsWithAI } = require("./services/logAnalysisService");

app.post("/api/test-ai", async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs)
      return res
        .status(400)
        .json({ error: "Logs array is required for testing" });

    console.log("🤖 Sending logs to AI for analysis...");

    // Default gemini use kar rahe hain test ke liye
    const aiResponse = await analyzeLogsWithAI(logs, "cohere");

    res.status(200).json({ success: true, aiAnalysis: aiResponse });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend build from backend/dist when available
const frontendDistPath = path.resolve(__dirname, "../dist");
app.use(express.static(frontendDistPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// --- ERROR HANDLERS ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
