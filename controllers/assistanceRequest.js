const AssistanceRequest = require("../models/assistanceRequest"); // Import your assistance request model
const User = require("../models/user"); // Import your user model

// Create a new assistance request
exports.createRequest = async (req, res) => {
  try {
    const { userId, userName, type, customRequest, seatNumber } = req.body;

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new request
    const newRequest = new AssistanceRequest({
      userId,
      userName,
      type,
      customRequest,
      seatNumber,
      status: "Pending",
    });

    await newRequest.save();
    return res
      .status(201)
      .json({ message: "Request created successfully", data: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all requests for conductors
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await AssistanceRequest.find({
      status: { $in: ["Pending", "In Progress"] },
    }).populate("userId", "firstName lastName seatNumber"); // Populate user details
    return res
      .status(200)
      .json({ message: "Requests fetched successfully", data: requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get requests for a specific user
exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await AssistanceRequest.find({ userId });
    return res
      .status(200)
      .json({ message: "User requests fetched successfully", data: requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Update the status of a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await AssistanceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    return res
      .status(200)
      .json({ message: "Request status updated successfully", data: request });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete a request (if needed)
exports.deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await AssistanceRequest.findByIdAndDelete(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
