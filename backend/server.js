const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db"); // if you have a separate DB config
const userRoutes = require("./routes/user"); // ✅ import new route

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  connectDB();
// ✅ Register routes
app.use("/api/user", userRoutes);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});