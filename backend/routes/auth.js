const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP Utility
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------- SIGNUP ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, method: "local" });
    await newUser.save();

    await transporter.sendMail({
      from: `"All-in-One Converter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to All-in-One Converter",
      html: `<h3>Welcome!</h3><p>Your account has been created successfully.</p>`
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.isTwoFAEnabled) {
      return res.status(200).json({
        message: "2FA required",
        twoFARequired: true,
        email: user.email
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name || "",
      email: user.email,
      profilePic: user.profilePic || ""
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------- GOOGLE LOGIN ----------------------
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        profilePic: picture,
        password: null,
        method: "google",
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("Google login error", error);
    res.status(401).json({ error: "Google login failed" });
  }
});

// ---------------------- VERIFY LOGIN 2FA ----------------------
router.post("/verify-login-2fa", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isTwoFAEnabled || !user.twoFASecret) {
      return res.status(400).json({ error: "2FA not configured properly" });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 1
    });

    if (!isVerified) {
      return res.status(400).json({ error: "Invalid 2FA token" });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      name: user.name || "",
      email: user.email,
      profilePic: user.profilePic || ""
    });
  } catch (err) {
    console.error("2FA login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------- GENERATE 2FA ----------------------
router.post("/generate-2fa", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const secret = speakeasy.generateSecret({ name: `All-in-One Converter (${email})` });

    user.twoFASecret = secret.base32;
    await user.save();

    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qr: qrCode, secret: secret.base32 });
  } catch (err) {
    console.error("2FA generation error:", err.message);
    res.status(500).json({ error: "Failed to generate 2FA" });
  }
});

// ---------------------- VERIFY 2FA SETUP ----------------------
router.post("/verify-2fa", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.twoFASecret) return res.status(400).json({ error: "2FA not initialized" });

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 1
    });

    if (isVerified) {
      user.isTwoFAEnabled = true;
      await user.save();
      res.json({ message: "2FA setup complete" });
    } else {
      res.status(400).json({ error: "Invalid verification code" });
    }
  } catch (err) {
    console.error("2FA verification error:", err.message);
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
});

// ---------------------- UPDATE PASSWORD ----------------------
router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ error: "Email and new password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
