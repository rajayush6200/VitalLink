const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* Multer config */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* POST /api/analyze */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const relativeImagePath = req.file.path.replace(/\\/g, "/");

    /* Call AI Service */
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5001/analyze";
    
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const aiRes = await fetch(aiServiceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Image, imagePath: relativeImagePath })
    });

    const aiData = await aiRes.json();

    return res.json({
      result: aiData.result,
      confidence: aiData.confidence,
      imagePath: relativeImagePath
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
