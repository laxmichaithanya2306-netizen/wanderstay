import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const AMENITIES_LIST = [
  "WiFi",
  "Free Breakfast",
  "Kitchen",
  "Swimming Pool",
  "Free Parking",
  "Air Conditioning",
  "TV",
  "Pet Friendly",
  "Gym",
  "Hiking Trails",
  "Beach Access",
  "Bonfire / Campfire",
  "Water Sports",
  "Restaurant on site",
  "Room Service",
];

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const [existingImages, setExistingImages] = useState([]); // URLs already saved
  const [newImages, setNewImages] = useState([]); // new File objects to upload
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const listing = res?.data?.listing || {};

        setForm({
          title: listing.title || "",
          description: listing.description || "",
          location: listing.location || "",
          price: listing.price || "",
        });

        setExistingImages(listing.images || []);
        setAmenities(listing.amenities || []);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching listing:", err);
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleNewFiles = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      alert("A listing needs at least one photo");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("location", form.location);
      data.append("price", form.price);
      data.append("existingImages", JSON.stringify(existingImages));

      amenities.forEach((item) => data.append("amenities", item));
      newImages.forEach((file) => data.append("newImages", file));

      await api.put(`/listings/${id}`, data);

      alert("Listing updated successfully!");
      navigate(`/listing/${id}`);
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-12 px-6 pb-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit listing</h2>
        <p className="text-gray-500 text-sm mb-6">Update your property details</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price / night</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Existing photos — with remove option */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Current photos</label>
            {existingImages.length === 0 ? (
              <p className="text-sm text-gray-400">No photos remaining — add new ones below.</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`photo-${i}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-rose-600"
                      title="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new photos */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Add new photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewFiles}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-rose-500 file:text-white file:font-medium hover:file:bg-rose-600 file:cursor-pointer cursor-pointer"
            />

            {newImages.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {newImages.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`new-preview-${i}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Facilities &amp; Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_LIST.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer transition ${
                    amenities.includes(item)
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                    className="accent-rose-500"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg py-3 mt-2 hover:opacity-90 transition shadow-sm"
          >
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditListing;