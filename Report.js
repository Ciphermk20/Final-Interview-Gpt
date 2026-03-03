const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: String,
  language: String,
  type: String,
  experience: String,
  question: String,
  transcript: String,
  videoUrl: String, // Path to the webm file in /uploads
  score: Number,
  feedback: String,
  tips: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);