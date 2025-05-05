const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// @desc Upload a single image file
// @route POST /api/uploads/upload-image
// @access Private
router.post("/upload-image", protect, upload, uploadImage);

module.exports = router;
