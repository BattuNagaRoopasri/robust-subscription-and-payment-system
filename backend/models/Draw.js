const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., "April 2026"
  dateExecuted: { type: Date, default: Date.now },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prizeAmount: { type: Number, required: true },
    matchType: { type: String, required: true } // e.g. "4-Number Match"
  }],
  status: { type: String, enum: ['Simulated', 'Published'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
