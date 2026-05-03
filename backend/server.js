// server.js
const path = require("path");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({
  path: path.resolve(__dirname, `.env.${nodeEnv}`),
  override: true,
});

const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http"); // Node ka in-built HTTP module
const socketIo = require("socket.io"); // Socket.io
const { isAllowedOrigin } = require("./src/config/runtime");

const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// 🌟 STEP 1: Express app ko HTTP server mein wrap karo
const server = http.createServer(app);

// 🌟 STEP 2: Socket.io ko HTTP server ke sath initialize karo
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Socket.IO CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🌟 STEP 3: Socket Room & Connection Logic
io.on("connection", (socket) => {
  console.log("🔌 New Client Connected:", socket.id);

  // Jab frontend bolega: "Mujhe is deployment ke logs dekhne hain"
  socket.on("join:deployment", (deploymentId) => {
    const roomName = `dep:${deploymentId}`;
    socket.join(roomName);
    console.log(`👤 Client ${socket.id} joined room: ${roomName}`);
  });

  // Jab frontend page chhod dega
  socket.on("leave:deployment", (deploymentId) => {
    const roomName = `dep:${deploymentId}`;
    socket.leave(roomName);
    console.log(`👤 Client ${socket.id} left room: ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

// 🌟 STEP 4: Deployment Engine (Controller) tak 'io' pahunchane ka tareeqa
app.set("io", io);

// 🌟 STEP 5: Start the server (app.listen ki jagah server.listen aayega)
server.listen(PORT, () => {
  console.log(`Server & WebSockets running perfectly on port ${PORT}`);
});
