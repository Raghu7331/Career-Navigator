const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'applied' },
  applied_at: { type: Date, default: Date.now },
  notes: String
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
