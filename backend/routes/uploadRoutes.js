const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "airbnb-clone" },
    (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error,
        });
      }

      return res.json({
        success: true,
        imageUrl: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;