const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
  verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  branch: { type: String },
  batchYear: { type: Number },
  collegeEmail: { type: String },
  linkedinUrl: { type: String },
  currentCompany: { type: String },
  currentRole: { type: String },
  karma: { type: Number, default: 0 },
  profilePhoto: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
