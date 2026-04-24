const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  totalRaised: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Disabled'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
