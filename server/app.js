require("dotenv").config();

const sequelize = require("./config/db.config");

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

//cors
const cors = require("cors");
// const User  = require("./config/db.config");
const userAddRoute = require("./routes/usersR");
const loginRoute = require("./routes/userLoginR");

const userUpdateRoute = require("./routes/userUpdateR");
const articleRoute = require("./routes/articleR");
const getUserRoute = require("./routes/getUserR");
const deleteUserR = require("./routes/deleteuserR");
const forgotpasswordRoute = require("./routes/forgotPasswordR");

const app = express();

// Middleware setup
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:4000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routes setup
app.use("/api", userAddRoute);
app.use("/api", loginRoute);

app.use("/api", userUpdateRoute);
app.use("/api", getUserRoute);
app.use("/api", deleteUserR);
app.use("/api", articleRoute);

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = "./uploads/";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/img/upload", upload.array("file"), (req, res) => {
  try {
    const urls = req.files.map((file) => {
      // Assuming that 'uploads' directory is in the public directory
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// async function syncDatabase() {
//   try {
//     await sequelize.sync({ alter: true, force: true }); //edit this as needed
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Error occurred during model synchronization:", error);
//   }
// }
//
// syncDatabase();

app.listen(5000, () => console.log("Server running on port 5000"));

