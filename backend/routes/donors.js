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

    // Paths to your AI model
    const pythonPath = path.resolve(__dirname, "..", "..", "ai-model", "venv", "Scripts", "python.exe");
    const scriptPath = path.resolve(__dirname, "..", "..", "ai-model", "predict.py");

    execFile(pythonPath, [scriptPath, imagePath], async (error, stdout, stderr) => {
      if (error) {
        console.error("❌ AI PROCESS ERROR:", error);
        return res.status(500).json({
          error: "AI analysis failed",
          details: stderr || error.message
        });
      }

      console.log("✅ AI RAW OUTPUT:", stdout);

      // --- CLEANING DATA ---
      const parts = stdout.trim().split(",");
      const resultRaw = parts[0] ? parts[0].toLowerCase().trim() : "unknown";
      const confidence = parts[1] ? Number(parts[1].trim()) : 0;

      // Normalize result strings
      let finalResult = resultRaw;
      if (resultRaw === "infection" || resultRaw === "infected") {
        finalResult = "infected";
      }

      // --- CREATE DONOR OBJECT ---
      // We create the object for BOTH cases now to track stats, 
      // but the result field differentiates them.
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
        // We save "infected" results to the DB so the Admin Chart works,
        // but they won't show up in the "Normal Donor" list because of the filter in route #1.
        await donorData.save();
        console.log("🚫 Infection detected. Saved to DB as 'infected' for Admin Stats.");
        
        return res.status(200).json({
          result: "infected",
          confidence: confidence,
          imagePath: req.file.path
        });
      }
    });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ error: "Donor submission failed" });
  }
});

module.exports = router;