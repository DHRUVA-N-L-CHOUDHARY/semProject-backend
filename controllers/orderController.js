const Order = require("../models/order");
const Bus = require("../models/bus");
const Seat = require("../models/seat");
const generateTicketPDF = require("../utils/pdfgenator");
const fs = require("fs");

exports.createOrder = async (req, res) => {
  try {
    const { userId, busId, seatId, journeyDate } = req.body;

    if (!userId || !busId || !seatId || !journeyDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the bus and seat
    const bus = await Bus.findById(busId);
    const seat = await Seat.findById(seatId);

    if (!bus || !seat) {
      return res.status(404).json({ error: "Bus or seat not found" });
    }

    // Check if the seat is already booked on the selected date
    const isSeatBooked = await Order.findOne({
      busId,
      selectedSeat: seatId,
      journeyDate: new Date(journeyDate),
      status: "confirmed",
    });

    if (isSeatBooked) {
      return res
        .status(400)
        .json({ error: "Seat is already booked for this date" });
    }

    // Calculate the price (You can adjust based on your business logic)
    const ticketPrice = 100; // Just an example, you might want to calculate this dynamically

    // Create an order
    const order = new Order({
      userId,
      busId,
      busNumber: bus.busNumber,
      selectedSeat: seatId,
      journeyDate,
      ticketPrice,
    });

    // Save the order to the database
    await order.save();

    // Return the created order as response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.bookTicket = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("selectedSeat");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order is already confirmed
    if (order.status === "confirmed") {
      return res.status(400).json({ error: "Ticket is already booked" });
    }

    // Update the seat status to 'booked'
    const seat = order.selectedSeat;
    seat.status = "booked"; // Or change the availability logic
    await seat.save();

    // Update the order status to 'confirmed'
    order.status = "confirmed";
    await order.save();

    // Return the booked ticket confirmation
    res.status(200).json({
      success: true,
      message: "Ticket booked successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createBusTicket = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("selectedSeat");
    if (!order || order.status !== "confirmed") {
      return res
        .status(404)
        .json({ error: "Order not found or not confirmed" });
    }

    // Prepare ticket details
    const ticketDetails = {
      ticketId: order._id,
      userId: order.userId,
      busNumber: order.busNumber,
      seat: order.selectedSeat.seatNumber,
      journeyDate: order.journeyDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
      ticketPrice: order.ticketPrice,
    };

    // Generate the ticket PDF
    const pdfFilePath = await generateTicketPDF(ticketDetails);

    // Send the PDF file as response
    res.status(200).json({
      success: true,
      message: "Ticket created successfully",
      ticket: ticketDetails,
      pdfFilePath: pdfFilePath, // Return the file path of the generated PDF
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createBusTicket = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("selectedSeat");
    if (!order || order.status !== "confirmed") {
      return res
        .status(404)
        .json({ error: "Order not found or not confirmed" });
    }

    // Prepare ticket details
    const ticketDetails = {
      ticketId: order._id,
      userId: order.userId,
      busNumber: order.busNumber,
      seat: order.selectedSeat.seatNumber,
      journeyDate: order.journeyDate.toISOString().split("T")[0],
      ticketPrice: order.ticketPrice,
    };

    // Generate the ticket PDF
    const pdfFilePath = await generateTicketPDF(ticketDetails);

    // Serve the PDF file for download
    res.download(pdfFilePath, `${ticketDetails.ticketId}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading the file", err);
        res.status(500).json({ error: "Error downloading the PDF" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all orders for a specific user
const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }).populate({
      path: "orders",
      populate: [
        { path: "busId", select: "busNumber" },
        { path: "selectedSeat", select: "seatNumber" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ orders: user.orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all orders for a specific bus
const getOrdersByBusId = async (req, res) => {
  const { busId } = req.params;

  try {
    const orders = await Order.find({ busId })
      .populate("userId", "name email")
      .populate("selectedSeat", "seatNumber");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this bus" });
    }

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all orders for a specific owner
const getOrdersByOwnerId = async (req, res) => {
  const { ownerId } = req.params;

  try {
    // Find buses by ownerId
    const buses = await Bus.find({ ownerId });

    if (!buses.length) {
      return res.status(404).json({ message: "No buses found for this owner" });
    }

    // Get all orders for the buses associated with the owner
    const orders = await Order.find({
      busId: { $in: buses.map((bus) => bus._id) },
    })
      .populate("userId", "name email")
      .populate("selectedSeat", "seatNumber");

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for these buses" });
    }

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOrdersByUserId,
  getOrdersByBusId,
  getOrdersByOwnerId,
};
