const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect MongoDB
connectDB();

// Routes
app.use("/api/user", userRoutes);      // ✅ Only once
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
