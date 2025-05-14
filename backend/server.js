const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db"); // ✅ use this
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect MongoDB
connectDB(); // ✅ only this one

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
