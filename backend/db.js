// db.js
const mongoose = require("mongoose");

const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MongoDB connection error: MONGO_URI is not set");
    return;
  }

  while (mongoose.connection.readyState !== 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      console.log(`⏳ Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
};

module.exports = connectDB;
