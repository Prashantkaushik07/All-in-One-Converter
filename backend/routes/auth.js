// auth.js - Complete Auth Routes
const express = require("express");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");
const geoip = require("geoip-lite");
const useragent = require("express-useragent");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const otpStore = {};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



router.use(useragent.express());

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function create2FAToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verify2FAToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function sendLoginVerificationEmail(email, details = {}) {
  const templatePath = path.join(__dirname, "../emails/loginVerification.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{username}}", details.username || "User")
    .replace("{{loginTime}}", details.loginTime)
    .replace("{{location}}", details.location)
    .replace("{{browser}}", details.browser)
    .replace("{{ip}}", details.ip)
    .replace("{{disable2FAURL}}", details.disable2FAURL || "#");

  await transporter.sendMail({
    from: `"All-in-One Converter" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "2FA Login Notification",
    html,
  });
}

router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "Missing Google credential" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || "Google User";
    const picture = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        profilePic: picture,
        verified: true,
      });
      await sendAccountChangeMail(email, "Google Signup", "Your account was created using Google.");
    }

    const token = createToken({ id: user._id });
    res.json({ message: "Login successful", token, name: user.name, email: user.email, profilePic: user.profilePic });

    await sendAccountChangeMail(email, "Google Login", "You logged in using Google.");
  } catch (err) {
    console.error("Google login failed:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  let { email, password } = req.body;
email = email?.toLowerCase();

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `<p>Your OTP is <b>${otp}</b>. Valid for 5 minutes.</p>`,
    });

    res.status(201).json({ message: "Signup complete. Verify your email." });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email?.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    const token = create2FAToken({ email });
    await transporter.sendMail({
      to: email,
      subject: "2FA Login OTP",
      html: `<p>Your OTP is <b>${otp}</b>. Valid for 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent", token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});


// Google Login
router.post("/google-login", async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, verified: true });
    }
    const token = createToken({ id: user._id });
    res.json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ error: "Google login failed" });
  }
});

// Verify Login 2FA
// Fix this route to return full user data

// Utility: Verify token
// const verify2FAToken = (token) => {
//   const secret = process.env.JWT_SECRET;
//   if (!secret) throw new Error("JWT_SECRET not set");
//   return jwt.verify(token, secret);
// };

// Utility: Create new token
// const createToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

// ✅ VERIFY LOGIN 2FA ROUTE
router.post("/verify-login-2fa", async (req, res) => {
  const { token, otp } = req.body;
  const email = req.body.email?.toLowerCase();

  try {
    console.log("🔐 Incoming token:", token);
    const payload = verify2FAToken(token);
    console.log("✅ Decoded JWT payload:", payload);

    const record = otpStore[payload.email];
    console.log("🕵️ OTP Record:", record);

    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const browser = req.useragent.browser + " on " + req.useragent.os;

    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const authToken = createToken({ id: user._id });

    await sendLoginVerificationEmail(payload.email, {
      username: user.name || "User",
      loginTime: new Date().toLocaleString(),
      location: geo.city ? `${geo.city}, ${geo.country}` : "Unknown",
      browser,
      ip,
      disable2FAURL: `${CLIENT_URL}/account/security`,
    });

    delete otpStore[payload.email]; // Invalidate used OTP

    // ✅ Send full user info
    res.status(200).json({
      message: "Login successful",
      token: authToken,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || "",
    });
  } catch (err) {
    console.error("❌ 2FA verification failed:", err.message || err);
    res.status(401).json({ error: "2FA verification failed" });
  }
});
// Resend OTP
router.post("/resend-otp", async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  email = email.toLowerCase(); // ✅ Normalize email

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new OTP
    const otp = generateOTP(); // Assumes this function exists
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    otpStore[email] = { otp, expires };

    // Send the email
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your New OTP Code",
      html: `<p>Your new OTP is: <b>${otp}</b></p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Sent OTP to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error in /resend-otp:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});


// Generate 2FA
router.post("/generate-2fa", async (req, res) => {
  let { email, ...rest } = req.body;
email = email?.toLowerCase();

  try {
    const user = await User.findOne({ email });
    const secret = speakeasy.generateSecret({ name: `All-in-One Converter (${email})` });
    user.twoFASecret = secret.base32;
    await user.save();
    const qr = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qr, secret: secret.base32 });
  } catch {
    res.status(500).json({ error: "2FA setup failed" });
  }
});

// Verify 2FA
router.post("/verify-2fa", async (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];
  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const finalToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete otpStore[email]; // Invalidate OTP after use

    res.json({
      token: finalToken,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic, // ✅ Include this
    });
  } catch (err) {
    console.error("2FA error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});


// Update Password
router.post("/update-password", async (req, res) => {
  let { email, ...rest } = req.body;
email = email?.toLowerCase();

  try {
    const user = await User.findOne({ email });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Forget Password
router.post("/forgot-password", async (req, res) => {
  let { email, ...rest } = req.body;
email = email?.toLowerCase();

  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const otp = generateOTP();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: `"All-in-One Converter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <h3>Password Reset Requested</h3>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Or click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link and OTP will expire in 15 minutes.</p>
      `
    });

    res.status(200).json({ message: "Reset link and OTP sent to email" });
  } catch (err) {
    console.error("Reset email error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  let { email, newPassword } = req.body; // ✅ FIXED
  email = email?.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // better error
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err); // ✅ Debug log
    res.status(500).json({ error: "Reset failed" });
  }
});


// Verify Email
router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  const user = await User.findOne({ email });
  user.verified = true;
  await user.save();
  delete otpStore[email];
  res.json({ message: "Email verified" });
});

// Verify Generic OTP
router.post("/verify-otp", (req, res) => {
  let { email, ...rest } = req.body;
email = email?.toLowerCase();
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  delete otpStore[email];
  res.json({ message: "OTP verified" });
});



// Delete Account
router.post("/delete", async (req, res) => {
  let { email, ...rest } = req.body;
email = email?.toLowerCase();
  try {
    await User.deleteOne({ email });
    res.json({ message: "Account deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
