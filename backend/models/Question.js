const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
  answersCount: { type: Number, default: 0 }
}, { timestamps: true });

questionSchema.index({ company: 1 });
questionSchema.index({ authorId: 1 });
questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);
