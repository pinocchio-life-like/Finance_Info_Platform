require("dotenv").config();
const sequelize = require("./config/db.config");

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const cors = require("cors");

const userAddRoute = require("./routes/usersR");
const loginRoute = require("./routes/userLoginR");
const userUpdateRoute = require("./routes/userUpdateR");
const articleRoute = require("./routes/articleR");
const categoryRoute = require("./routes/categoryRoute");
const versionRoute = require("./routes/articleVersionR");
const questionRoutes = require("./routes/Q&ARoutes/questionRoute");
const answerRoutes = require("./routes/Q&ARoutes/answerRoute");
const commentRoutes = require("./routes/Q&ARoutes/commentRoute");
const tagsRoutes = require("./routes/Q&ARoutes/tagsRoute");
const uploadRoute = require("./routes/uploadRoute/uploadRoute");
const searchRoutes = require("./routes/searchRoute");
const companyRoutes = require("./routes/CompanyRoute/companyRoutes");
const ftpRoute = require("./routes/ftpRoutes/FtpR");

const app = express();
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:4000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));

app.use(express.json());
// Routes setup
app.use("/api", userAddRoute);
app.use("/api", loginRoute);
app.use("/api", userUpdateRoute);
app.use("/api", articleRoute);
app.use("/api", categoryRoute);
app.use("/api", versionRoute);
app.use("/api", questionRoutes);
app.use("/api", answerRoutes);
app.use("/api", commentRoutes);
app.use("/api", uploadRoute);
app.use("/api", tagsRoutes);
app.use("/api", searchRoutes);
app.use("/api", companyRoutes);

app.use(
  "/Article/Images",
  express.static(path.join(__dirname, "Article/Images"))
);

app.use(
  "/Article/Files",
  express.static(path.join(__dirname, "Article/Files"))
);
app.use("/api", ftpRoute);

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); //edit this as needed
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error occurred during model synchronization:", error);
  }
}

// syncDatabase();

app.listen(5000, () => console.log("Server running on port 5000"));
