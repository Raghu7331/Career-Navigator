const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  recipient_email: { type: String, required: true },
  subject: String,
  message: String,
  message_type: { type: String, default: 'general' },
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  error_message: String,
  sent_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', EmailLogSchema);
