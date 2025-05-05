// controllers/uploadController.js

const uploadImage = (req, res) => {
  if (!req.file) {
      return res.status(400).json({
          success: false,
          message: "No file uploaded or invalid file format",
      });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
          filePath: `/uploads/${req.file.filename}`,
          filename: req.file.filename,
          url: imageUrl
      }
  });
};

module.exports = { uploadImage };
