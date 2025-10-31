const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, default: 'Admin' },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
