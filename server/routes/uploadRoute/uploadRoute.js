const router = require("express").Router();

const multer = require("multer");
const AWS = require("aws-sdk");

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: "AKIA5TY3KKQWQYIFCI6G",
  secretAccessKey: "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",
  region: "us-east-1",
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/article/img/upload", upload.array("file"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const uploadSingle = (file) =>
    new Promise((resolve, reject) => {
      const timestamp = Date.now(); // Current time in milliseconds// Extracting the file extension
      const name = `${timestamp}-${file.originalname}`;

      const params = {
        Bucket: "wihfinanceapp/article/images",
        Key: name, // Use the file's original name as the S3 key
        Body: file.buffer, // Use the buffer from multer for the file body
        ContentType: file.mimetype, // Set the correct MIME type for the file
      };

      // Upload the file to S3
      s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location); // Return the URL of the uploaded file in S3
        }
      });
    });

  Promise.all(req.files.map((file) => uploadSingle(file)))
    .then((urls) => {
      res.send({ urls }); // Return an array of URLs for the uploaded files
    })
    .catch((err) => {
      console.error("Error uploading to S3:", err);
      res.status(500).send("Error uploading files");
    });
});

module.exports = router;
