const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");

// Create Booking
router.post("/", auth, bookingController.createBooking);

// Get My Bookings
router.get("/mine", auth, bookingController.getMyBookings);

module.exports = router;
