const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Donor = require("../models/Donor");
const { analyzeBloodImage } = require("../utils/aiClient");
const { isDatabaseReady, databaseUnavailableResponse } = require("../utils/db");

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

router.get("/normal", async (req, res) => {
  try {
    const donors = await Donor.find({ ai_result: "normal" });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

router.get("/ai-stats", async (req, res) => {
  try {
    const normalCount = await Donor.countDocuments({ ai_result: "normal" });
    const infectedCount = await Donor.countDocuments({ ai_result: "infected" });

    res.json({
      normal: normalCount,
      infected: infectedCount,
      total: normalCount + infectedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    let finalResult;
    let confidence;

    try {
      const aiData = await analyzeBloodImage(req.file.path);
      finalResult = aiData.result;
      confidence = aiData.confidence;
    } catch (error) {
      console.error("AI PROCESS ERROR:", error.message);
      return res.status(502).json({
        error: "AI analysis failed",
        details: error.message,
      });
    }

    if (!isDatabaseReady()) {
      return res.status(503).json({
        error: "Analysis completed but database is unavailable",
        result: finalResult,
        confidence,
      });
    }

    const donorData = new Donor({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      blood_group: req.body.blood_group,
      image: req.file.path,
      ai_result: finalResult,
      confidence: confidence,
    });

    await donorData.save();

    if (finalResult === "normal") {
      console.log("Donor saved (Normal)");
      return res.status(201).json({
        result: "normal",
        confidence: confidence,
        imagePath: req.file.path,
      });
    }

    console.log("Infection detected — saved as infected for admin stats");
    return res.status(200).json({
      result: "infected",
      confidence: confidence,
      imagePath: req.file.path,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Donor submission failed", details: err.message });
  }
});

module.exports = router;
