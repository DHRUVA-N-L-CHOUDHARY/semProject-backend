const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    busNumber: {
      type: String,
      required: true
    },
    selectedSeat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true
    },
    journeyDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending'
    },
    ticketPrice: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
