const express = require('express');
const { searchBuses } = require('../controllers/searchController');
const {updateAvailability, addBusSchedule} = require("../controllers/availabilityController");

const router = express.Router();

router.get('/search', searchBuses);
router.put('/updateAvailability', updateAvailability);
router.post('/addSchedule', addBusSchedule);

module.exports = router;
