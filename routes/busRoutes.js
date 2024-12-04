const express = require('express');
const {
  addBus,
  getAllBuses,
  getOwnerBuses,
  changeBusOwner,
  assignStaff,
  removeStaff,
  updateBusStops,
  searchBuses,
  bookSeat,
  unbookSeat,
  updateBus,
  getBus
} = require('../controllers/busController');

const router = express.Router();

// Admin and Owner - Add a Bus
router.post('/add', addBus);

router.post('/update/:id', updateBus);

router.get('/buses/:id', getBus);

// Admin - List All Buses
router.get('/admin/list', getAllBuses);

// Owner - List Buses Under Him
router.get('/owner/list/:ownerId', getOwnerBuses);

// Admin - Change Bus Owner
router.patch('/change-owner/:busId', changeBusOwner);

// Owner - Assign/Remove Staff
router.patch('/assign-staff/:busId', assignStaff);
router.patch('/remove-staff/:busId', removeStaff);

// Owner - Update Bus Stops
router.patch('/update-stops/:busId', updateBusStops);

// User - Search Buses
router.get('/search', searchBuses);

// User - Book Seat
router.post('/book-seat', bookSeat);

router.post('/unbook-seat', unbookSeat);

module.exports = router;
