const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  agreePrivacy: { type: Boolean, required: true },
  community: { type: String, required: true },
  service: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  filename: { type: String, required: true },
  storage: { type: String, enum: ['local','s3'], default: 'local' },
  size: { type: Number },
  mimeType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', AudioSchema);
