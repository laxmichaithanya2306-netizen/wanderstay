import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getCurrentUser, isLoggedIn } from "../api/auth";

function SingleListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res?.data?.listing || res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch (err) {
      alert("You're not allowed to delete this listing");
      console.log(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg("");

    if (!isLoggedIn()) {
      alert("Please log in to book a stay");
      navigate("/login");
      return;
    }

    try {
      await api.post("/bookings", { listing: id, checkIn, checkOut });
      setBookingMsg("✅ Booking confirmed!");
      setCheckIn("");
      setCheckOut("");
    } catch (err) {
      setBookingMsg(`❌ ${err?.response?.data?.message || "Booking failed"}`);
    }
  };

  if (!listing) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const isOwner = currentUser && listing.user === currentUser.id;
  const images = listing.images || [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Main image */}
      <img
        src={images[activeImage]}
        alt={listing.title}
        className="w-full h-96 object-cover rounded-2xl"
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              onClick={() => setActiveImage(i)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                activeImage === i ? "border-rose-500" : "border-transparent"
              }`}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{listing.title}</h2>
          <p className="text-gray-500 mt-1">{listing.location}</p>
          <p className="text-lg font-semibold text-gray-900 mt-3">
            ₹{listing.price} <span className="text-gray-500 font-normal text-sm">/ night</span>
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-rose-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-rose-600 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-700 leading-relaxed">{listing.description}</p>

      {listing.amenities && listing.amenities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">What this place offers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {listing.amenities.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isOwner && (
        <div className="mt-8 border border-gray-200 rounded-2xl p-6 max-w-sm shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Book this stay</h3>

          <form onSubmit={handleBooking} className="flex flex-col gap-3">
            <label className="text-sm text-gray-600">
              Check-in
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </label>

            <label className="text-sm text-gray-600">
              Check-out
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </label>

            <button
              type="submit"
              className="bg-rose-500 text-white font-medium rounded-lg py-2.5 mt-2 hover:bg-rose-600 transition"
            >
              Reserve
            </button>

            {bookingMsg && <p className="text-sm mt-2 text-center">{bookingMsg}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default SingleListing;