const express = require("express");
const Upload = require("../models/Upload");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  console.log("✅ Upload route hit");

  const { filename, fileType, fileBase64 } = req.body;

  if (!filename || !fileType || !fileBase64) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const buffer = Buffer.from(fileBase64, "base64");

  const newFile = new Upload({
    userId: req.user.userId,
    filename,
    fileType,
    fileData: buffer
  });

  await newFile.save();

  res.status(201).json({ message: "File uploaded", fileId: newFile._id });
});

module.exports = router;
