const jwt = require("jsonwebtoken");
const User = require("../models/User");

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

const attachUserFromToken = async (req, token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id || decoded.userId || null;
  let dbUser = null;

  if (userId) {
    dbUser = await User.findById(userId).select("_id email role");
  }

  req.user = {
    ...decoded,
    id: userId || decoded.id || decoded.userId || null,
    email: decoded.email || dbUser?.email || null,
    role: dbUser?.role || decoded.role || "user",
  };
};

const requireAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    await attachUserFromToken(req, token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const optionalAuth = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    req.authInvalid = false;
    return next();
  }

  try {
    await attachUserFromToken(req, token);
    req.authInvalid = false;
  } catch (_err) {
    req.user = null;
    req.authInvalid = true;
  }

  next();
};

module.exports = requireAuth;
module.exports.requireAuth = requireAuth;
module.exports.optionalAuth = optionalAuth;
