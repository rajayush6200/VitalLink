const express = require("express");
const multer = require("multer");
const path = require("path");
const fetch = require("node-fetch");

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

    const imagePath = req.file.path;

    /* Call AI Service */
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5001/analyze";

    const aiRes = await fetch(aiServiceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath })
    });

    const aiData = await aiRes.json();

    return res.json({
      result: aiData.result,
      confidence: aiData.confidence,
      imagePath
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
