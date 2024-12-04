const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the Owner model
      required: true,
    },
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to the Staff model
      },
    ],
    busCapacity: {
      type: Number,
      required: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat", // Refers to the Seat model
      },
    ],
    schedule: [
      {
        date: { type: Date, required: true },
        availableSeats: { type: Number, required: true },
      },
    ],
    source: {
      type: String,
      // Refers to the Stops model
      required: true,
    },
    destination: {
      type: String,
      // Refers to the Stops model
      required: true,
    },
    busPhotos: {
      type: [String], // URLs of bus photos
      default: [],
    },
    bus3DModels: {
      type: [String], // URLs of 3D model data
      default: [],
    },
    earningPerDay: {
      type: Number,
      default: 0,
    },
    restStops: [
      [
        {
          type: String,
        },
      ],
    ],
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
