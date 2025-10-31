const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  experience_level: String,
  salary_range: String,
  description: String,
  requirements: String,
  skills: { type: [String], default: [] },
  job_type: { type: String, default: 'Full-time' },
  status: { type: String, default: 'active' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
