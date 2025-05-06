const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

router.post("/upload-image", protect, upload.single("image"), uploadImage);

module.exports = router;
