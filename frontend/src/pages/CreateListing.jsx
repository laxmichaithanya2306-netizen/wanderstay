import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

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

function CreateListing() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
  });

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one photo");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("location", form.location);
      data.append("price", form.price);

      images.forEach((file) => {
        data.append("images", file);
      });

      amenities.forEach((item) => {
        data.append("amenities", item);
      });

      await api.post("/listings", data);

      alert("Created!");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 px-6 pb-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create a listing</h2>
        <p className="text-gray-500 text-sm mb-6">Share your place with travelers</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input
              name="title"
              placeholder="e.g. Cozy beachside cottage"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              placeholder="Tell guests what makes this place special"
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
                placeholder="City, State"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price / night</label>
              <input
                name="price"
                placeholder="₹"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Property photos (up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-rose-500 file:text-white file:font-medium hover:file:bg-rose-600 file:cursor-pointer cursor-pointer"
            />

            {images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
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
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;