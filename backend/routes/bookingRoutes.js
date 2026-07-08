const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const {
  createBooking,
  getMyBookings,
  getBookingsForListing,
} = require("../controllers/bookingcontroller");

router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/listing/:listingId", getBookingsForListing);

module.exports = router;