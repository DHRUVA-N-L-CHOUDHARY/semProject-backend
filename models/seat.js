const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
    },
    seatType: {
      type: String,
      enum: ['Regular', 'Luxury', 'Sleeper', 'Semi-Sleeper'], // Customize as needed
      required: true,
    },
    seatId: {
      type: String,
      required: true,
      unique: true,
    },
    seatPrice: {
      type: Number,
      required: true,
    },
    seatPick: {
      type: String, // Optional field for specific pickup points
      default: null,
    },
    booked: {
      type: Boolean,
      default: false, // Initially, all seats are unbooked
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seat', seatSchema);
