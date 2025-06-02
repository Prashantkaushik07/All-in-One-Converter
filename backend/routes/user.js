const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ storage });

/**
 * ✅ Update Profile
 * Allows name, country, and profilePic to be updated.
 */
// const { upload } = require("../config/cloudinary");

router.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { email, name, country } = req.body;
    const profilePicUrl = req.file?.path;

    const updatedUser = await User.findOneAndUpdate(
      { email: email?.toLowerCase() }, // normalize
      {
        ...(name && { name }),
        ...(country && { country }),
        ...(profilePicUrl && { profilePic: profilePicUrl }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        country: updatedUser.country,
        profilePic: updatedUser.profilePic,
      },
    });

    console.log("Profile updated:", {
      email,
      name,
      country,
      profilePic: profilePicUrl,
    });
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET user profile by email
router.post("/get-profile", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        country: user.country,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});




/**
 * ✅ Delete Account
 * Deletes user by email.
 */
router.delete("/delete", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required to delete account" });
  }

  try {
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

module.exports = router;
