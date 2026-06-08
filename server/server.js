const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { startReminderCron } = require("./utils/reminderCron");

connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight for all routes
app.options("*", cors());

app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/subscriptions", require("./routes/subscriptions"));

// ── Health check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:  "✅ SubTrack API running!",
    version: "1.0.0",
    time:    new Date().toISOString(),
  });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Start server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startReminderCron();
});