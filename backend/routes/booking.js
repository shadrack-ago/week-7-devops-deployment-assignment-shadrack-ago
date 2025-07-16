const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Train = require('../models/Train');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);

// Admin: Get all bookings
router.get('/all', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  try {
    const bookings = await Booking.find()
      .populate('user', 'email')
      .populate('train');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all bookings' });
  }
});

module.exports = router; 