const express = require("express");
const router = express.Router();

// Cloudinary-enabled multer middleware (uses .single('image'))
const upload = require("../middlewares/uploadMiddleware");

// Auth middleware
const { protect } = require("../middlewares/authMiddleware");

// Controller
const { uploadImage } = require("../controllers/uploadController");

// @desc    Upload a single image to Cloudinary
// @route   POST /api/uploads/upload-image
// @access  Private
router.post("/upload-image", protect, upload, uploadImage);

module.exports = router;
