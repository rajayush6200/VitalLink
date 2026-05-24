const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { analyzeBloodImage } = require("../utils/aiClient");

const router = express.Router();

const uploadsDir = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const relativeImagePath = req.file.path.replace(/\\/g, "/");
    const aiData = await analyzeBloodImage(req.file.path);

    return res.json({
      result: aiData.result,
      confidence: aiData.confidence,
      imagePath: relativeImagePath,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(502).json({ error: "AI analysis failed", details: err.message });
  }
});

module.exports = router;
