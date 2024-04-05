require("dotenv").config();
const sequelize = require("./config/db.config");

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
// const companyR=require('./routes/companyR')
const versionRoute = require("./routes/articleVersionR");
const questionRoutes = require("./routes/Q&ARoutes/questionRoute");
const answerRoutes = require("./routes/Q&ARoutes/answerRoute");
const commentRoutes = require("./routes/Q&ARoutes/commentRoute");
const uploadRoute = require("./routes/uploadRoute/uploadRoute");

const app = express();
// Middleware setup
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:4000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
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
// app.use('/api',companyR)
app.use("/api", versionRoute);
app.use("/api", questionRoutes);
app.use("/api", answerRoutes);
app.use("/api", commentRoutes);
app.use("/api", uploadRoute);

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); //edit this as needed
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error occurred during model synchronization:", error);
  }
}

//  syncDatabase();

app.listen(5000, () => console.log("Server running on port 5000"));
