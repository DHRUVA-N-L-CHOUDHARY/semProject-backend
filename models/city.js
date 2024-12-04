const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      unique: true,
    },
    cityPincode: {
      type: String,
      required: true,
      unique: true,
    },
    stops: [
      {
        stopId: {
          type: String,
          required: true,
        },
        stopName: {
          type: String,
          required: true,
        },
        stopTimings: {
          type: String, // Example: "08:30 AM"
          required: true,
        },
        stopDuration: {
          type: Number, // Duration in minutes
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
