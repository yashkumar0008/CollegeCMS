const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'faculty'], required: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
