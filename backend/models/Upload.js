const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ["user", "guest"],
      default: "user",
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    guestId: { type: String, default: null, index: true },
    originalName: { type: String, default: "" },
    fileName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    storagePath: { type: String, default: "" },
    url: { type: String, default: "" },
    category: {
      type: String,
      enum: ["image", "file"],
      default: "file",
    },
    status: {
      type: String,
      enum: ["processed"],
      default: "processed",
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

uploadSchema.index({ guestId: 1, ownerType: 1 });
uploadSchema.index({ userId: 1, ownerType: 1, createdAt: -1 });
uploadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Upload", uploadSchema);
