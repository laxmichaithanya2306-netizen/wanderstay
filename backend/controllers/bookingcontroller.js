const Booking = require("../models/booking");
const Listing = require("../models/Listing");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { listing, checkIn, checkOut } = req.body;

    if (!listing || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
    }

    // Check for overlapping bookings on this listing
    const overlap = await Booking.findOne({
      listing,
      checkIn: { $lt: outDate },
      checkOut: { $gt: inDate },
    });

    if (overlap) {
      return res.status(400).json({ success: false, message: "These dates are already booked" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      listing,
      checkIn: inDate,
      checkOut: outDate,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.log("Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get bookings made BY the logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("listing");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get already-booked date ranges for a specific listing (so frontend can block them)
exports.getBookingsForListing = async (req, res) => {
  try {
    const bookings = await Booking.find({ listing: req.params.listingId });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};