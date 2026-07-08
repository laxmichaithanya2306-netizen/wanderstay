import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchListings = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const res = await api.get(`/listings?${params.toString()}`);
      setListings(res.data?.listings || []);
    } catch (err) {
      console.log("Error fetching listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings({ location, minPrice, maxPrice });
  };

  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    fetchListings();
  };

  return (
    <div>
      {/* Hero / search banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-1">Find your next stay</h1>
          <p className="text-white/90 text-sm mb-6">Search homes, cabins, and unique places to stay</p>

          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-3 bg-white rounded-2xl shadow-lg p-4"
          >
            <input
              type="text"
              placeholder="Search by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-32 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-lg px-6 py-2 hover:opacity-90 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-200 text-gray-600 font-medium rounded-lg px-6 py-2 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center mt-10 text-gray-500">Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No listings found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item, i) => {
              const badges = [
                "bg-rose-100 text-rose-700",
                "bg-amber-100 text-amber-700",
                "bg-sky-100 text-sky-700",
                "bg-emerald-100 text-emerald-700",
                "bg-violet-100 text-violet-700",
              ];
              const badge = badges[i % badges.length];

              return (
                <Link
                  key={item._id}
                  to={`/listing/${item._id}`}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition bg-white"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
                      {item.location}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="mt-1.5 font-bold text-rose-500">
                      ₹{item.price} <span className="text-gray-500 font-normal text-sm">/ night</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;