const express = require("express");
const router = express.Router();

// Middlewares
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Must export multer instance

// Controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { uploadImage } = require("../controllers/uploadController");

// Auth Routes
router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);

// User Profile Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Image Upload Route (optional/extra)
router.post("/upload-images", protect, upload.single("image"), uploadImage);

module.exports = router;
