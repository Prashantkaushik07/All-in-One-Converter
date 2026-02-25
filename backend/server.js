const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const connectDB = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");
const ROUTES = require("./config/routes");

const app = express();

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Keep API responses explicit when MongoDB is unavailable.
app.use((req, res, next) => {
  if (req.path.startsWith("/api/") && mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database unavailable. Please try again shortly." });
  }
  next();
});
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect MongoDB
connectDB();

// Routes
app.use(ROUTES.USERS_BASE, userRoutes);      // ✅ Only once
app.use(ROUTES.AUTH_BASE, authRoutes);
app.use(ROUTES.UPLOAD_BASE, uploadRoutes);
app.use(ROUTES.UPLOADS_BASE, uploadRoutes);
app.use(ROUTES.ADMIN_BASE, adminRoutes);
app.use("/api/user", userRoutes);      // ✅ Only once
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
