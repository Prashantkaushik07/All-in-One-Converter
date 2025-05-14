const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    required: true,
  },
  country: {
    type: String,
    default: "",
  },
  profilePic: {
    type: String, // Cloudinary URL or local path
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
