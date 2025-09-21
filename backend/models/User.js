const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // To be hashed with bcrypt
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);