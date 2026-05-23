const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userType: { type: String, enum: ['student', 'alumni'], required: true },
  proofType: { type: String, enum: ['college_email', 'college_id'], required: true },
  proofUrl: { type: String },
  collegeEmail: { type: String },
  linkedinUrl: { type: String },
  branch: { type: String },
  batchYear: { type: Number },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  adminNote: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);
