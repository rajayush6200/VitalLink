const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");

/* ➕ CREATE blood request (USER) */
/* ➕ CREATE blood request (USER) */
/* ➕ CREATE blood request (USER) */
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    // ❌ Check if user already has an active request
    const existingRequest = await BloodRequest.findOne({
      userId,
      status: { $in: ["Pending", "Approved"] }
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "You already have an active blood request"
      });
    }

    const request = new BloodRequest(req.body);
    await request.save();

    res.status(201).json({
      message: "Blood request submitted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to submit request" });
  }
});



/* 📥 GET ALL requests (ADMIN) */
router.get("/", async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/* 👤 GET requests of ONE user */
router.get("/user/:userId", async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user requests" });
  }
});

/* 🔄 UPDATE request status (ADMIN) */
router.put("/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const updateData = { status };

    if (status === "Rejected") {
      updateData.rejectionReason = rejectionReason || "Not specified";
    } else {
      updateData.rejectionReason = ""; // clear for Approved / Pending
    }

    const updated = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
});


module.exports = router;
