const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Log to verify the function is called
    console.log('Inside destination function');

    // Extract folder_name and folder_url from the request body
    const { folder_name, folder_url } = req.body;
    console.log('Request body:', req.body);

    // Create the directory path based on folder_name and folder_url
    const uploadDir = path.join(__dirname, 'uploads', folder_url, folder_name);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Set the destination path
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up Multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;