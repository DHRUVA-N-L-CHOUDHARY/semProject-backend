const mongoose = require("mongoose");

const assistanceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },
  type: { type: String, required: true },
  customRequest: { type: String },
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssistanceRequest", assistanceRequestSchema);
