const City = require("../models/city");

// 1. Admin and Owner - Create Source/Destination City
exports.createCity = async (req, res) => {
  try {
    const { cityName, cityPincode, stops } = req.body;

    const newCity = new City({
      cityName,
      cityPincode,
      stops,
    });

    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res.status(500).json({ message: "Error creating city", error });
  }
};

// 2. Admin and Owner - Delete City
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByIdAndDelete(id);
    if (!city) return res.status(404).json({ message: "City not found" });

    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting city", error });
  }
};

exports.getCity = async (req, res) => {
  try {
    const { id } = req.params;
    let city = null;
    if (id.length == 6) {
      city = await City.findOne({ cityPincode: id });
    } else {
      city = await City.findById(id);
    }
  
    console.log(city);

    if (!city) return res.status(404).json({ message: "City not found" });

    res.status(200).json({ message: "City deleted successfully", city });
  } catch (error) {
    res.status(500).json({ message: "Error getting city", error });
  }
};

// 3. Admin and Owner - Get List of All Cities with Filters, Sorting, and Pagination
exports.getAllCities = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", filter } = req.query;
    const query = filter ? { cityName: { $regex: filter, $options: "i" } } : {};

    const cities = await City.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await City.countDocuments(query);

    res.status(200).json({
      total,
      cities,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
};

// 4. User - Search Cities (Source/Destination Only)
exports.searchCities = async (req, res) => {
  try {
    const { query } = req.query;

    const cities = await City.find({
      cityName: { $regex: query, $options: "i" },
    });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error searching cities", error });
  }
};

// 5. Admin/Owner - Add/Update Stops to a City
exports.addStops = async (req, res) => {
  try {
    const { pincode } = req.params;
    const { stops } = req.body;

    const city = await City.findOne({ cityPincode: pincode });
    if (!city) return res.status(404).json({ message: "City not found" });

    console.log(stops);
    city.stops.push(...stops);
    await city.save();

    res.status(200).json({ message: "Stops added successfully", city });
  } catch (error) {
    res.status(500).json({ message: "Error adding stops", error });
  }
};

// 6. Admin/Owner - Delete Stop from a City
exports.deleteStop = async (req, res) => {
  try {
    const { pincode, stopId } = req.params;

    const city = await City.findOne({ cityPincode: pincode });
    if (!city) return res.status(404).json({ message: "City not found" });

    city.stops = city.stops.filter((stop) => stop.stopId !== stopId);
    await city.save();

    res.status(200).json({ message: "Stop deleted successfully", city });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stop", error });
  }
};
