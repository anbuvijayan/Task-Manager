const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getUser, updateUserProfile } = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// GET /api/users
router.get("/", protect, getUser);

// PUT /api/users/profile  ✅ Match frontend
router.put("/profile", protect, updateUserProfile);

module.exports = router;
