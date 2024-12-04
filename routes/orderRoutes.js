const express = require("express");
const router = express.Router();

// Controllers
const {
  createOrder,
  createBusTicket,
  bookBusTicket,
} = require("../controllers/orderController");

const {
  getOrdersByUserId,
  getOrdersByBusId,
  getOrdersByOwnerId,
} = require("../controllers/orderController");

// Route to get all orders for a specific user
router.get("/user/:userId/orders", getOrdersByUserId);

// Route to get all orders for a specific bus
router.get("/bus/:busId/orders", getOrdersByBusId);

// Route to get all orders for a specific owner
router.get("/owner/:ownerId/orders", getOrdersByOwnerId);

// Ticket Routes
router.post("/ticket", createBusTicket); // Create a bus ticket
router.post("/book-ticket", bookBusTicket); // Book a bus ticket

// Order Routes
router.post("/order", createOrder); // Create an order for bus ticket booking

module.exports = router;
