const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ storage });

// ✅ Update Profile
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
  console.log('Received profile update:', {
    email,
    name,
    country,
    file: req.file,
  }
  );
});

// ✅ Delete Account
router.delete("/delete", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required to delete account" });
  }

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

module.exports = router;
