const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "task-manager-users",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Export Multer instance
const upload = multer({ storage });

module.exports = upload;
