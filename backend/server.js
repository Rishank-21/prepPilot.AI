require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();
const origins = [process.env.PRODUCTION_URL, process.env.FRONTEND_URL];
if (process.env.NODE_ENV !== "production") origins.push("http://localhost:5173", "http://127.0.0.1:5173");

app.use(cors({
  origin: origins.filter(Boolean).map((origin) => origin.trim().replace(/\/$/, "")),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isReady = () => mongoose.connection.readyState === 1 && Boolean(process.env.JWT_SECRET);
app.get("/health", (_req, res) => {
  const ready = isReady();
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});
app.use("/api", (_req, res, next) => {
  if (!isReady()) return res.status(503).json({ message: "The server is temporarily unavailable. Please try again shortly." });
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", (_req, res) => res.status(404).json({ message: "Endpoint not found." }));
app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === "LIMIT_FILE_SIZE" ? 413 : error.status || 500;
  res.status(status).json({ message: status < 500 ? error.message : "Unexpected server error." });
});

async function initializeDatabase() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is required for database-backed requests.");
    return;
  }
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed (%s). Retrying in 10 seconds.", error.name);
    setTimeout(initializeDatabase, 10000).unref();
  }
}

if (!process.env.JWT_SECRET) console.error("JWT_SECRET is required for authentication.");
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  initializeDatabase();
});
