const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");

const Upload = require("../models/Upload");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const router = express.Router();
const uploadsDir = path.resolve(__dirname, "..", "uploads");
const MAX_GUEST_UPLOADS = 5;

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const base = path
      .basename(file.originalname || "file", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 80);
    cb(null, `${Date.now()}-${base || "upload"}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 20,
  },
});

const uploadFields = upload.fields([
  { name: "files", maxCount: 20 },
  { name: "file", maxCount: 1 },
]);

const jsonError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

const getRequestFiles = (req) => {
  const filesFromArray = Array.isArray(req.files?.files) ? req.files.files : [];
  const filesFromSingle = Array.isArray(req.files?.file) ? req.files.file : [];

  return [...filesFromArray, ...filesFromSingle].filter(Boolean);
};

const buildUploadPayload = (req, file, owner) => {
  const storagePath = `/uploads/${file.filename}`;
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  const category = file.mimetype && file.mimetype.startsWith("image/") ? "image" : "file";

  return {
    ownerType: owner.ownerType,
    userId: owner.userId,
    guestId: owner.guestId,
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    storagePath,
    url: `${baseUrl}${storagePath}`,
    category,
    status: "processed",
  };
};

const resolveUploadPath = (storagePath = "") => {
  const normalized = String(storagePath).replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized.startsWith("uploads/")) return null;

  const relative = normalized.slice("uploads/".length);
  const resolved = path.resolve(uploadsDir, relative);

  if (!resolved.startsWith(`${uploadsDir}${path.sep}`) && resolved !== uploadsDir) {
    return null;
  }

  return resolved;
};

const getOwnerFromRequest = (req) => {
  if (req.headers.authorization && !req.user && req.authInvalid) {
    return {
      error: "Invalid or expired token",
      status: 401,
    };
  }

  if (req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)) {
    return {
      ownerType: "user",
      userId: req.user.id,
      guestId: null,
    };
  }

  const guestIdHeader = (req.headers["x-guest-id"] || "").toString().trim();
  const guestIdBody = (req.body?.guestId || "").toString().trim();
  const guestId = guestIdHeader || guestIdBody;

  if (!guestId) {
    return null;
  }

  return {
    ownerType: "guest",
    userId: null,
    guestId,
  };
};

router.post("/", optionalAuth, uploadFields, async (req, res) => {
  const incomingFiles = getRequestFiles(req);

  if (incomingFiles.length === 0) {
    return jsonError(res, 400, "No files received");
  }

  const owner = getOwnerFromRequest(req);
  if (owner?.error) {
    return jsonError(res, owner.status || 401, owner.error);
  }
  if (!owner) {
    return jsonError(res, 400, "Guest ID is required for guest uploads.");
  }

  try {
    if (owner.ownerType === "guest") {
      const currentCount = await Upload.countDocuments({
        ownerType: "guest",
        guestId: owner.guestId,
        isDeleted: { $ne: true },
      });

      if (currentCount + incomingFiles.length > MAX_GUEST_UPLOADS) {
        return jsonError(
          res,
          429,
          "Guest upload limit reached (max 5 files). Please login to upload more."
        );
      }
    }

    const docsToInsert = incomingFiles.map((file) => buildUploadPayload(req, file, owner));
    const createdUploads = await Upload.insertMany(docsToInsert);

    const uploads = createdUploads.map((item) => ({
      id: item._id,
      originalName: item.originalName,
      mimeType: item.mimeType,
      size: item.size,
      url: item.url,
      createdAt: item.createdAt,
      status: item.status,
    }));

    return res.status(200).json({
      success: true,
      uploads,
      // Backward compatibility for older single-file consumers
      upload: createdUploads[0] || null,
      url: createdUploads[0]?.url || null,
      message: "Upload successful",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return jsonError(res, 500, "Upload failed");
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const status = (req.query.status || "").toString().trim();

  try {
    const filter = {
      userId: req.user.id,
      isDeleted: { $ne: true },
      $or: [{ ownerType: "user" }, { ownerType: { $exists: false } }],
    };

    if (status === "processed") {
      filter.$and = [{ $or: [{ status: "processed" }, { status: { $exists: false } }] }];
    } else if (status) {
      filter.status = status;
    }

    const [uploads, total] = await Promise.all([
      Upload.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("originalName fileName mimeType size storagePath url status createdAt"),
      Upload.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      uploads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    console.error("Get my uploads error:", err);
    return jsonError(res, 500, "Failed to fetch uploads");
  }
});

router.get("/guest", optionalAuth, async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const status = (req.query.status || "").toString().trim();
  const guestId = (req.headers["x-guest-id"] || req.query.guestId || "").toString().trim();

  if (!guestId) {
    return jsonError(res, 400, "Guest ID is required.");
  }

  try {
    const filter = {
      ownerType: "guest",
      guestId,
      isDeleted: { $ne: true },
    };

    if (status === "processed") {
      filter.$and = [{ $or: [{ status: "processed" }, { status: { $exists: false } }] }];
    } else if (status) {
      filter.status = status;
    }

    const [uploads, total] = await Promise.all([
      Upload.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("originalName fileName mimeType size storagePath url status createdAt"),
      Upload.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      uploads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    console.error("Get guest uploads error:", err);
    return jsonError(res, 500, "Failed to fetch guest uploads");
  }
});

router.get("/:id/download", optionalAuth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return jsonError(res, 400, "Invalid upload ID");
  }

  try {
    const uploadDoc = await Upload.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!uploadDoc) {
      return jsonError(res, 404, "Upload not found");
    }

    const ownerType =
      uploadDoc.ownerType || (uploadDoc.userId ? "user" : uploadDoc.guestId ? "guest" : null);

    if (ownerType === "user") {
      if (!req.user?.id || String(uploadDoc.userId) !== String(req.user.id)) {
        return jsonError(res, 403, "You are not allowed to download this file");
      }
    } else if (ownerType === "guest") {
      const guestId = (req.headers["x-guest-id"] || "").toString().trim();
      if (!guestId || guestId !== uploadDoc.guestId) {
        return jsonError(res, 403, "You are not allowed to download this file");
      }
    } else {
      return jsonError(res, 403, "You are not allowed to download this file");
    }

    const filePath = resolveUploadPath(uploadDoc.storagePath);
    if (!filePath) {
      return jsonError(res, 400, "Upload is not a local file");
    }

    await fs.promises.access(filePath, fs.constants.F_OK);
    return res.download(filePath, uploadDoc.originalName || uploadDoc.fileName || "download");
  } catch (err) {
    if (err.code === "ENOENT") {
      return jsonError(res, 404, "File not found on disk");
    }

    console.error("Download upload error:", err);
    return jsonError(res, 500, "Failed to download file");
  }
});

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return jsonError(res, 400, err.message);
  }
  return next(err);
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    res.status(200).json({
      message: "Upload successful",
      url: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
