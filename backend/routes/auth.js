// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const speakeasy = require("speakeasy");
// const qrcode = require("qrcode");
// const { OAuth2Client } = require("google-auth-library");
// const User = require("../models/User");
// const { sendLoginEmail } = require("../utils/sendEmail");
// const useragent = require("express-useragent");
// const geoip = require("geoip-lite");

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // Email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // OTP Utility
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // ---------------------- SIGNUP ----------------------
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ email, password: hashedPassword, method: "local" });
//     await newUser.save();

//     await transporter.sendMail({
//       from: `"All-in-One Converter" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Welcome to All-in-One Converter",
//       html: `<h3>Welcome!</h3><p>Your account has been created successfully.</p>`
//     });

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.status(200).json({ message: "Signup successful", token });
//   } catch (err) {
//     console.error("Signup error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ---------------------- LOGIN ----------------------
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     if (user.isTwoFAEnabled) {
//       return res.status(200).json({
//         message: "2FA required",
//         twoFARequired: true,
//         email: user.email
//       });
//     }

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       name: user.name || "",
//       email: user.email,
//       profilePic: user.profilePic || ""
//     });
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ---------------------- GOOGLE LOGIN ----------------------
// router.post("/google-login", async (req, res) => {
//   const { credential } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = new User({
//         email,
//         name,
//         profilePic: picture,
//         password: null,
//         method: "google",
//       });
//       await user.save();
//     }

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       name: user.name,
//       email: user.email,
//       profilePic: user.profilePic,
//     });

//   } catch (error) {
//     console.error("Google login error", error);
//     res.status(401).json({ error: "Google login failed" });
//   }
// });

// // ---------------------- VERIFY LOGIN 2FA ----------------------
// // router.post("/verify-login-2fa", async (req, res) => {
// //   const { email, token } = req.body;

// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user || !user.isTwoFAEnabled || !user.twoFASecret) {
// //       return res.status(400).json({ error: "2FA not configured properly" });
// //     }

// //     const isVerified = speakeasy.totp.verify({
// //       secret: user.twoFASecret,
// //       encoding: "base32",
// //       token,
// //       window: 1
// //     });

// //     if (!isVerified) {
// //       return res.status(400).json({ error: "Invalid 2FA token" });
// //     }

// //     const jwtToken = jwt.sign(
// //       { userId: user._id, email: user.email },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "1d" }
// //     );

// //     res.status(200).json({
// //       message: "Login successful",
// //       token: jwtToken,
// //       name: user.name || "",
// //       email: user.email,
// //       profilePic: user.profilePic || ""
// //     });
// //   } catch (err) {
// //     console.error("2FA login error:", err.message);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // Add middleware at the top of your file if not already done:
// router.use(useragent.express());

// router.post("/verify-login-2fa", async (req, res) => {
//   const { email, token } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !user.isTwoFAEnabled || !user.twoFASecret) {
//       return res.status(400).json({ error: "2FA not configured properly" });
//     }

//     const isVerified = speakeasy.totp.verify({
//       secret: user.twoFASecret,
//       encoding: "base32",
//       token,
//       window: 1
//     });

//     if (!isVerified) {
//       return res.status(400).json({ error: "Invalid 2FA token" });
//     }

//     const jwtToken = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Capture client IP and user agent info
//     const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     const geo = geoip.lookup(ip) || {};
//     const browser = req.useragent.browser + " on " + req.useragent.os;

//     // Send 2FA login email
//     await sendLoginEmail(user.email, {
//       username: user.name || "User",
//       loginTime: new Date().toLocaleString(),
//       location: geo.city ? `${geo.city}, ${geo.country}` : "Unknown",
//       browser,
//       ip,
//       disable2FAURL: `https://yourdomain.com/account/security` // Customize this
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token: jwtToken,
//       name: user.name || "",
//       email: user.email,
//       profilePic: user.profilePic || ""
//     });
//   } catch (err) {
//     console.error("2FA login error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ---------------------- GENERATE 2FA ----------------------
// router.post("/generate-2fa", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const secret = speakeasy.generateSecret({ name: `All-in-One Converter (${email})` });

//     user.twoFASecret = secret.base32;
//     await user.save();

//     const qrCode = await qrcode.toDataURL(secret.otpauth_url);
//     res.json({ qr: qrCode, secret: secret.base32 });
//   } catch (err) {
//     console.error("2FA generation error:", err.message);
//     res.status(500).json({ error: "Failed to generate 2FA" });
//   }
// });

// // ---------------------- VERIFY 2FA SETUP ----------------------
// router.post("/verify-2fa", async (req, res) => {
//   const { email, token } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !user.twoFASecret) return res.status(400).json({ error: "2FA not initialized" });

//     const isVerified = speakeasy.totp.verify({
//       secret: user.twoFASecret,
//       encoding: "base32",
//       token,
//       window: 1
//     });

//     if (isVerified) {
//       user.isTwoFAEnabled = true;
//       await user.save();
//       res.json({ message: "2FA setup complete" });
//     } else {
//       res.status(400).json({ error: "Invalid verification code" });
//     }
//   } catch (err) {
//     console.error("2FA verification error:", err.message);
//     res.status(500).json({ error: "Failed to verify 2FA" });
//   }
// });

// // ---------------------- UPDATE PASSWORD ----------------------
// router.post("/update-password", async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword) return res.status(400).json({ error: "Email and new password are required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const hashed = await bcrypt.hash(newPassword, 10);
//     user.password = hashed;
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (err) {
//     console.error("Password update error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { sendLoginEmail } = require("../utils/sendEmail");
const useragent = require("express-useragent");
const geoip = require("geoip-lite");

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

// Middleware
router.use(useragent.express());

// SIGNUP
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

// LOGIN
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

// GOOGLE LOGIN
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

// VERIFY LOGIN 2FA
router.post("/verify-login-2fa", async (req, res) => {
  const { email, token } = req.body;
  console.log("Received verify-login-2fa:", { email, token });

  if (!email || !token) {
    return res.status(400).json({ error: "Email and token required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : null);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.isTwoFAEnabled || !user.twoFASecret) {
      return res.status(400).json({ error: "2FA not configured properly" });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: token.toString(),
      window: 1
    });

    if (!isVerified) {
      return res.status(400).json({ error: "Invalid 2FA token" });
    }

    // ... proceed with login success

  } catch (err) {
    console.error("2FA login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// GENERATE 2FA
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

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
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
//router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: "Email is required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "User not found" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m"
//     });

//     const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
//     const otp = generateOTP();
//     otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

//     await transporter.sendMail({
//       from: `"All-in-One Converter" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset your password",
//       html: `
//         <h3>Password Reset Requested</h3>
//         <p>Your OTP is: <strong>${otp}</strong></p>
//         <p>Or click the link below to reset your password:</p>
//         <a href="${resetLink}" target="_blank">${resetLink}</a>
//         <p>This link and OTP will expire in 15 minutes.</p>
//       `
//     });

//     res.status(200).json({ message: "Reset link and OTP sent to email" });
//   } catch (err) {
//     console.error("Forgot-password error:", err); // check what the actual error is
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify Email (extended)
router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const user = await User.findOne({ email });
  if (user) {
    user.verified = true;
    await user.save();
  }

  delete otpStore[email];
  return res.status(200).json({ message: "Email verified successfully" });
});

// ✅ Update Password Route
// router.post("/update-password", async (req, res) => {
//   const { email, newPassword } = req.body;

//   if (!email || !newPassword) {
//     return res.status(400).json({ error: "Email and new password are required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const hashed = await bcrypt.hash(newPassword, 10);
//     user.password = hashed;
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (err) {
//     console.error("Password update error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[email];
  return res.status(200).json({ message: "OTP verified successfully" });
});

// VERIFY 2FA SETUP
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


// UPDATE PASSWORD
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
