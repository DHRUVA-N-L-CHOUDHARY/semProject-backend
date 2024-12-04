const Bus = require("../models/bus");
const Seat = require("../models/seat");
const User = require("../models/user");

// 1. Admin and Owner - Add a Bus
exports.addBus = async (req, res) => {
  try {
    const {
      busId,
      ownerId,
      staff,
      busCapacity,
      source,
      destination,
      restStops,
      busNumber,
    } = req.body;

    const newBus = new Bus({
      busId,
      ownerId,
      staff,
      busCapacity,
      source,
      destination,
      restStops,
      busNumber,
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(500).json({ message: "Error adding bus", error });
  }
};

// 9. Admin/Owner - Update Bus Details
exports.updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { busCapacity, source, destination, restStops, staff, busNumber } =
      req.body;

    // Find the bus by its ID
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Update bus details
    bus.busCapacity = busCapacity || bus.busCapacity;
    bus.source = source || bus.source;
    bus.destination = destination || bus.destination;
    bus.restStops = restStops || bus.restStops;
    bus.staff = staff || bus.staff;
    bus.busNumber = busNumber || bus.busNumber;

    // Save the updated bus details
    const updatedBus = await bus.save();

    res
      .status(200)
      .json({ message: "Bus details updated successfully", updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus details", error });
  }
};

exports.getBus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the bus by its ID
    const bus = await Bus.findOne({busId : id});
    console.log(bus);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus details updated successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus details", error });
  }
};

// 2. Admin - List all Buses with Filters, Sorting, and Pagination
exports.getAllBuses = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", filter } = req.query;
    const query = filter ? { [filter.key]: filter.value } : {};

    const buses = await Bus.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Bus.countDocuments(query);

    res
      .status(200)
      .json({
        total,
        buses,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching buses", error });
  }
};

// 3. Owner - List All Buses Under Him
exports.getOwnerBuses = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const buses = await Bus.find({ ownerId });
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner buses", error });
  }
};

// 4. Admin - Change Bus Owner
exports.changeBusOwner = async (req, res) => {
  try {
    const { busId } = req.params;
    const { newOwnerId } = req.body;

    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      { ownerId: newOwnerId },
      { new: true }
    );
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

    res
      .status(200)
      .json({ message: "Bus owner updated successfully", updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Error changing bus owner", error });
  }
};

// 5. Owner - Assign/Remove Staff
exports.assignStaff = async (req, res) => {
  try {
    const { busId } = req.params;
    const { staffId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.staff.push(staffId);
    await bus.save();

    res.status(200).json({ message: "Staff assigned successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Error assigning staff", error });
  }
};

exports.removeStaff = async (req, res) => {
  try {
    const { busId } = req.params;
    const { staffId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.staff = bus.staff.filter((id) => id.toString() !== staffId);
    await bus.save();

    res.status(200).json({ message: "Staff removed successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Error removing staff", error });
  }
};

// 6. Owner - Update Bus Source and Destination
exports.updateBusStops = async (req, res) => {
  try {
    const { busId } = req.params;
    const { source, destination } = req.body;

    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      { source, destination },
      { new: true }
    );
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

    res
      .status(200)
      .json({ message: "Bus stops updated successfully", updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus stops", error });
  }
};

// 7. User - List Buses Based on Search
exports.searchBuses = async (req, res) => {
  try {
    const { source, destination } = req.query;

    const buses = await Bus.find({ source, destination });
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: "Error searching buses", error });
  }
};

// 8. User - Book Seats
exports.bookSeat = async (req, res) => {
  try {
    const { busId, seatId, userId } = req.body;

    const bus = await Bus.findById(busId).populate("seats");
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const seat = bus.seats.find((seat) => seat._id.toString() === seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    // Check if the seat is already booked
    if (seat.booked) {
      return res.status(400).json({ message: "Seat is already booked" });
    }

    // Update the seat as booked
    const updatedSeat = await Seat.findByIdAndUpdate(
      seatId,
      { booked: true },
      { new: true }
    );

    // Add booking logic here if needed, e.g., creating a booking record

    res
      .status(200)
      .json({ message: "Seat booked successfully", seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ message: "Error booking seat", error });
  }
};

exports.unbookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    if (!seat.booked) {
      return res.status(400).json({ message: "Seat is not booked" });
    }

    // Update the seat as unbooked
    const updatedSeat = await Seat.findByIdAndUpdate(
      seatId,
      { booked: false },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Seat unbooked successfully", seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ message: "Error unbooking seat", error });
  }
};
