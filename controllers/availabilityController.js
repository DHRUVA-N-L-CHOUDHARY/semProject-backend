const Bus = require('../models/bus');

exports.updateAvailability = async (req, res) => {
  try {
    const { busId, date, seatsAvailable } = req.body;

    if (!busId || !date || seatsAvailable === undefined) {
      return res.status(400).json({ error: 'Bus ID, date, and seats available are required' });
    }

    // Update the schedule for the specified bus
    const updatedBus = await Bus.findOneAndUpdate(
      { busId, 'schedule.date': new Date(date) },
      { $set: { 'schedule.$.availableSeats': seatsAvailable } },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ error: 'Bus or schedule not found' });
    }

    res.status(200).json({ success: true, bus: updatedBus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.addBusSchedule = async (req, res) => {
  try {
    const { busId, schedule } = req.body;

    if (!busId || !schedule) {
      return res.status(400).json({ error: 'Bus ID and schedule are required' });
    }

    const bus = await Bus.findOneAndUpdate(
      { busId },
      { $push: { schedule: { $each: schedule } } },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.status(200).json({ success: true, bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.addBusSchedule = async (req, res) => {
  try {
    const { busId, schedule } = req.body;

    if (!busId || !schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ error: 'Bus ID and schedule array are required' });
    }

    // Add each schedule entry to the bus
    const bus = await Bus.findOneAndUpdate(
      { busId },
      { $push: { schedule: { $each: schedule } } },
      { new: true, upsert: false } // Avoid creating a new bus if not found
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.status(200).json({ success: true, message: 'Schedule added successfully', bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
