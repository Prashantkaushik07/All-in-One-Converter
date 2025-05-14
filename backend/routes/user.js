const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary"); // ✅ Correct path
const User = require("../models/User");

const router = express.Router();
const upload = multer({ storage });

router.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { email, name, country } = req.body;
    const profilePic = req.file?.path;

    const updated = {
      ...(name && { name }),
      ...(country && { country }),
      ...(profilePic && { profilePic }),
    };

    const user = await User.findOneAndUpdate({ email }, updated, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
