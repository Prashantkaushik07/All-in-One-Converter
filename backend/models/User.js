// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "", // Required only for local method
    },
    country: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "", // Cloudinary URL or local path
    },
    twoFASecret: {
      type: String,
    },
    isTwoFAEnabled: {
      type: Boolean,
      default: false,
    },
    method: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);