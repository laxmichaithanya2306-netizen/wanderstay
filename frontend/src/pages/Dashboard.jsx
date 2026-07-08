import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listingsRes, bookingsRes] = await Promise.all([
        api.get("/listings/mine/all"),
        api.get("/bookings/my-bookings"),
      ]);

      setMyListings(listingsRes.data?.listings || []);
      setMyBookings(bookingsRes.data?.bookings || []);
    } catch (err) {
      console.log("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await api.delete(`/listings/${id}`);
      setMyListings(myListings.filter((l) => l._id !== id));
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {myListings.length} listing{myListings.length !== 1 ? "s" : ""} &middot; {myBookings.length} booking{myBookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => navigate("/create")}
          className="bg-rose-500 text-white text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-rose-600 transition shadow-sm"
        >
          + New Listing
        </button>
      </div>

      {/* My Listings */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          My Listings
        </h2>

        {myListings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">
            <p className="text-gray-500 text-sm">You haven't created any listings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {myListings.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition"
              >
                <Link to={`/listing/${item._id}`}>
                  <div className="h-28 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{item.title}</h3>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{item.location}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-1.5">
                    ₹{item.price} <span className="font-normal text-gray-500 text-xs">/ night</span>
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-1.5 text-xs font-medium hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      className="flex-1 bg-gray-900 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-gray-800 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Bookings */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          My Bookings
        </h2>

        {myBookings.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">
            <p className="text-gray-500 text-sm">You haven't booked any stays yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {myBookings.map((b) => (
              <div
                key={b._id}
                className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-white hover:shadow-sm transition"
              >
                <img
                  src={b.listing?.image}
                  alt={b.listing?.title}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/listing/${b.listing?._id}`}
                    className="font-medium text-gray-900 text-sm hover:text-rose-500 transition truncate block"
                  >
                    {b.listing?.title}
                  </Link>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{b.listing?.location}</p>
                </div>

                <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-3 py-1.5 whitespace-nowrap">
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;