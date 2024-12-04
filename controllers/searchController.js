const Bus = require('../models/bus');

exports.searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ error: 'Source, destination, and date are required' });
    }

    const searchDate = new Date(date);

    // Search buses by source, destination, and schedule availability
    const buses = await Bus.find({
      source: new RegExp(`^${source}$`, 'i'),
      destination: new RegExp(`^${destination}$`, 'i'),
      'schedule.date': searchDate,
    });

    res.status(200).json({ success: true, buses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
