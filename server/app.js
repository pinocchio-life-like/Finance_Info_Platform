require("dotenv").config();
const sequelize = require("./config/db.config");
const multer = require("multer");

const express = require("express");

const cookieParser = require("cookie-parser");

//cors
const cors = require("cors");
// const User  = require("./config/db.config");
const userAddRoute = require("./routes/usersR");
const loginRoute = require("./routes/userLoginR");

const userUpdateRoute = require("./routes/userUpdateR");
const articleRoute = require("./routes/articleR");
const categoryRoute = require("./routes/categoryRoute");
const companyR = require("./routes/companyR");
const versionRoute = require("./routes/articleVersionR");

const app = express();

// Middleware setup
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:4000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

/************ Test S3*********************** */

const AWS = require("aws-sdk");

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: "AKIA5TY3KKQWQYIFCI6G",
  secretAccessKey: "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",
  region: "us-east-1",
});

app.use(express.json());
// Routes setup
app.use("/api", userAddRoute);
app.use("/api", loginRoute);

app.use("/api", userUpdateRoute);
app.use("/api", articleRoute);
app.use("/api", categoryRoute);
app.use("/api", companyR);
app.use("/api", versionRoute);

// Set up multer for file storage

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.array("file"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const uploadSingle = (file) =>
    new Promise((resolve, reject) => {
      const timestamp = Date.now(); // Current time in milliseconds// Extracting the file extension
      const name = `${timestamp}-${file.originalname}`;

      const params = {
        Bucket: "wihfinanceapp/Uploads",
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
// async function syncDatabase() {
//   try {
//     await sequelize.sync({ alter: true, force: false }); //edit this as needed
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Error occurred during model synchronization:", error);
//   }
// }

// syncDatabase();

app.listen(5000, () => console.log("Server running on port 5000"));
