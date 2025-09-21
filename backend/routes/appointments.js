const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Book an appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const slot = doctor.availability.find(a => a.day === new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
      && a.slots.some(s => s.start.toISOString() === new Date(`${date}T${time}`).toISOString() && !s.booked));
    if (!slot) return res.status(400).json({ message: 'No available slot' });

    slot.slots.find(s => s.start.toISOString() === new Date(`${date}T${time}`).toISOString()).booked = true;
    await doctor.save();

    const appointment = new Appointment({ patientId: req.user.id, doctorId, date, time });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get appointments for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.userId }).populate('doctorId', 'specialty');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel an appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.patientId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const doctor = await Doctor.findById(appointment.doctorId);
    const slot = doctor.availability.find(a => a.day === new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' }));
    slot.slots.find(s => s.start.toISOString() === new Date(`${appointment.date}T${appointment.time}`).toISOString()).booked = false;
    await doctor.save();

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;