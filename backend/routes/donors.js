const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { execFile } = require("child_process");
const Donor = require("../models/Donor");

/* Multer setup */
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* 1. GET only normal donors for the list */
router.get("/normal", async (req, res) => {
  try {
    const donors = await Donor.find({ ai_result: "normal" });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

/* 2. GET AI Statistics for Admin Dashboard Insights */
router.get("/ai-stats", async (req, res) => {
    try {
        const normalCount = await Donor.countDocuments({ ai_result: "normal" });
        const infectedCount = await Donor.countDocuments({ ai_result: "infected" });

        res.json({
            normal: normalCount,
            infected: infectedCount,
            total: normalCount + infectedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* 3. POST donor + AI analysis */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const imagePath = path.resolve(req.file.path);

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5001/analyze";
    
    // Convert absolute path to relative path for the flask app
    const relativeImagePath = req.file.path.replace(/\\/g, "/");

    try {
      const fetch = (await import('node-fetch')).default;
      const aiRes = await fetch(aiServiceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: relativeImagePath })
      });

      if (!aiRes.ok) {
        throw new Error(`AI Service returned ${aiRes.status}`);
      }

      const aiData = await aiRes.json();
      const finalResult = aiData.result;
      const confidence = aiData.confidence;

      // --- CREATE DONOR OBJECT ---
      const donorData = new Donor({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        blood_group: req.body.blood_group,
        image: req.file.path,
        ai_result: finalResult,
        confidence: confidence
      });

      if (finalResult === "normal") {
        await donorData.save();
        console.log("💾 Donor saved (Normal)");
        
        return res.status(201).json({
          result: "normal",
          confidence: confidence,
          imagePath: req.file.path
        });
      } else {
        await donorData.save();
        console.log("🚫 Infection detected. Saved to DB as 'infected' for Admin Stats.");
        
        return res.status(200).json({
          result: "infected",
          confidence: confidence,
          imagePath: req.file.path
        });
      }
    } catch (error) {
      console.error("❌ AI PROCESS ERROR:", error);
      return res.status(500).json({
        error: "AI analysis failed",
        details: error.message
      });
    }

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ error: "Donor submission failed" });
  }
});

module.exports = router;