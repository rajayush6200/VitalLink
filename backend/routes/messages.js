const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

/* USER → SEND MESSAGE */
router.post("/", async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

/* ADMIN → GET ALL MESSAGES */
router.get("/", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

/* USER → GET OWN MESSAGES */
router.get("/user/:userId", async (req, res) => {
  const messages = await Message.find({ userId: req.params.userId })
    .sort({ createdAt: -1 });
  res.json(messages);
});

/* ADMIN → REPLY */
router.put("/:id/reply", async (req, res) => {
  const { reply } = req.body;

  const updated = await Message.findByIdAndUpdate(
    req.params.id,
    { reply },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;
