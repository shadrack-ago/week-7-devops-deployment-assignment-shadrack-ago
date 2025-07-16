const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Train', trainSchema); 