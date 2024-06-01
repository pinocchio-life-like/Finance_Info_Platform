const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Middleware to ensure req.body is populated before multer processes files
const ensureBody = (req, res, next) => {
  multer().none()(req, res, () => {
    console.log("req.body in ensureBody middleware:", req.body); 
    if (!req.body.folder_name || !req.body.folder_url) {
      return res.status(400).send("Folder URL and name are required.");
    }
    next();
  });
};

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder_name, folder_url } = req.body;
    console.log("folder_name:", folder_name); 
    console.log("folder_url:", folder_url); 

    // Check if folder_name or folder_url is undefined
    if (!folder_name || !folder_url) {
      return cb(new Error("Folder URL and name are required."));
    }

    const uploadDir = path.join(__dirname, 'uploads/', folder_url, folder_name);
    console.log("uploadDir:", uploadDir); 

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up Multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = { upload, ensureBody };
