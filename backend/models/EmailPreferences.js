const mongoose = require('mongoose');

const EmailPreferencesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  job_alerts: { type: Boolean, default: true },
  career_guidance: { type: Boolean, default: true },
  notifications: { type: Boolean, default: true },
  marketing: { type: Boolean, default: false }
});

module.exports = mongoose.model('EmailPreferences', EmailPreferencesSchema);
