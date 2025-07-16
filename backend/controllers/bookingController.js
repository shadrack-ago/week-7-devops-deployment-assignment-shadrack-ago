const Booking = require('../models/Booking');
const Train = require('../models/Train');

exports.createBooking = async (req, res) => {
  try {
    const { trainId, seats } = req.body;
    if (!trainId || !seats) {
      return res.status(400).json({ message: 'trainId and seats are required' });
    }
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    if (train.seatsAvailable < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    train.seatsAvailable -= seats;
    await train.save();
    const booking = new Booking({
      user: req.user.userId,
      train: trainId,
      seats,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('train');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
}; 