const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ['Admin', 'Owner', 'Staff', 'User'],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    ownerDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: function () {
        return this.accountType === 'Staff';
      },
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    buses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: function () {
          return this.accountType === 'Staff' || this.accountType === 'Owner';
        },
      },
    ],
    profileImage: {
      type: String,
      default: '', // URL of the profile image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
