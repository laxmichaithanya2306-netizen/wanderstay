const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Listing = require("../models/Listing");
const authMiddleware = require("../authMiddleware");

// GET MY LISTINGS (protected) — must come before "/:id" route
router.get("/mine/all", authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL (public) — supports ?location=&minPrice=&maxPrice=
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter);
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ONE (public)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE (protected — must be logged in, up to 5 images)
router.post("/", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const uploadToCloudinary = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "airbnb-clone" },
          (err, result) => {
            if (result) resolve(result);
            else reject(err);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    let amenities = req.body.amenities || [];
    if (!Array.isArray(amenities)) amenities = [amenities];

    const listing = await Listing.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      images: imageUrls,
      amenities,
      user: req.user.id,
    });

    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE (protected — only the owner). Accepts new images + kept existing images.
router.put("/:id", authMiddleware, upload.array("newImages", 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.user?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this listing" });
    }

    // Images the user kept (still checked/not removed) come as a JSON string array
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch {
        existingImages = [];
      }
    }

    // Upload any newly added files
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadToCloudinary = (fileBuffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "airbnb-clone" },
            (err, result) => {
              if (result) resolve(result);
              else reject(err);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });

      const uploaded = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
      newImageUrls = uploaded.map((img) => img.secure_url);
    }

    const finalImages = [...existingImages, ...newImageUrls];

    let amenities = req.body.amenities || [];
    if (!Array.isArray(amenities)) amenities = [amenities];

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        amenities,
        images: finalImages.length > 0 ? finalImages : listing.images,
      },
      { new: true }
    );

    res.json({ success: true, listing: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE (protected — only the owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.user?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;