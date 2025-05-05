const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/authController');

const { uploadImage } = require('../controllers/uploadController');

// Auth
router.post("/register", upload, registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// File Upload
router.post("/upload-images", upload, uploadImage);

module.exports = router;
