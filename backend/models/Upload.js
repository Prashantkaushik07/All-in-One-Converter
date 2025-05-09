const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  fileType: String,
  fileData: Buffer,
  uploadDate: { type: Date, default: Date.now, expires: '30d' }
});

module.exports = mongoose.model("Upload", uploadSchema);
