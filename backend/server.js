require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Global Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

// 3. Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/uploads", uploadRoutes);

// 5. Health Check Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "✅ Task Manager API is running" });
});

// 6. Fallback for Unknown Routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "🚫 Route not found" });
});

// 7. Centralized Error Handler
app.use(errorHandler);

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
