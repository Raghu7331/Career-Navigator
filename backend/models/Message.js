const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'sender_type' },
  sender_type: { type: String, enum: ['admin', 'user'], required: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'recipient_type' },
  recipient_type: { type: String, enum: ['admin', 'user', 'all_users'] },
  subject: String,
  content: { type: String, required: true },
  message_type: { type: String, default: 'general' },
  target_skills: { type: [String], default: [] },
  is_read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
