const uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid format",
      });
    }
  
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: req.file.path, // Cloudinary secure URL
        filename: req.file.filename,
      },
    });
  };
  
  module.exports = { uploadImage };
  