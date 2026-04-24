const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Store as YYYY-MM-DD
    required: [true, 'Date is required'],
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [45, 'Score cannot exceed 45'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Ensure only one score entry per user per date
scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
