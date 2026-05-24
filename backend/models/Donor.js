const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  blood_group: {
    type: String,
    required: true
  },
  image: {
    type: String, // uploaded file path
    required: true
  },

  // ✅ ADD THESE TWO FIELDS
  ai_result: {
    type: String,   // "normal" or "infection"
    required: true
  },
  confidence: {
    type: Number,   // e.g. 0.87
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donor', donorSchema);
