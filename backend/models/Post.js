const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  roleTitle: { type: String, required: true },
  ctc: { type: String, required: true },
  selectionStatus: { type: String, enum: ['Selected', 'Rejected'], default: 'Selected' },
  rounds: { type: String, required: true },
  questions: { type: String },
  tips: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tags: [{ type: String }],
  batchYear: { type: Number, required: true }
}, { timestamps: true });

postSchema.index({ company: 1 });
postSchema.index({ authorId: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
