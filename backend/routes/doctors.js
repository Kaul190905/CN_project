const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('userId specialty clinic');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('userId specialty clinic availability');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new doctor (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { userId, specialty, clinic, availability } = req.body;
    const doctor = new Doctor({ userId, specialty, clinic, availability });
    await doctor.save();
    res.status(201).json({ message: 'Doctor added', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update doctor availability
router.put('/:id/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { availability }, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Availability updated', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;