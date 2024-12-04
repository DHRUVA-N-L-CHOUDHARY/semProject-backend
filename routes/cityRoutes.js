const express = require('express');
const {
  createCity,
  deleteCity,
  getAllCities,
  searchCities,
  addStops,
  deleteStop,
  getCity
} = require('../controllers/cityController');

const router = express.Router();

// Admin and Owner - Create City
router.post('/create', createCity);

// Admin and Owner - Delete City
router.delete('/delete/:id', deleteCity);

router.get('/city/:id', getCity);

// Admin and Owner - Get All Cities with Filters, Sorting, and Pagination
router.get('/list', getAllCities);

// User - Search Cities (Source/Destination Only)
router.get('/search', searchCities);

// Admin and Owner - Add Stops to City
router.patch('/add-stops/:pincode', addStops);

// Admin and Owner - Delete Stop from City
router.delete('/delete-stop/:pincode/:stopId', deleteStop);

module.exports = router;
