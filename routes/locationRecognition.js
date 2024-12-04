const express = require("express");
const { recognizeLocation } = require("../controllers/locationRecognition");

const router = express.Router();

// Route for recognizing locations
router.post("/recognize", recognizeLocation);

module.exports = router;
