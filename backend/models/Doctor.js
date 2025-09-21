const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  clinic: {
    name: String,
    address: String
  },
  availability: [{
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    slots: [{
      start: Date,
      end: Date,
      booked: { type: Boolean, default: false }
    }]
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema);