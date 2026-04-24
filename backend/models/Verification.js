const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  drawMonth: {
    type: String,
    required: [true, 'Draw month is required (e.g. October 2023)'],
  },
  proofImage: {
    type: String,
    required: [true, 'Proof image URL/Path is required'],
  },
  status: {
    type: String,
    enum: ['Pending Review', 'Approved', 'Rejected', 'Paid'],
    default: 'Pending Review',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Verification', verificationSchema);
