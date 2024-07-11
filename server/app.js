require("dotenv").config();
const sequelize = require("./config/db.config");
const verifyUserMiddleware = require("./middleware/verifyUserMiddleware");
const verifyFileUserMiddleware = require("./middleware/verifyFileUserMiddleware");

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
const folderRoutes = require("./routes/FtpRoutes/folderRoutes");
const fileRoutes = require("./routes/FtpRoutes/fileRoutes");
const noticeRoute = require("./routes/NoticeRoute/noticeRoute");
const taskRoutes = require("./routes/NoticeRoute/taskRoute");

const app = express();
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

app.use(express.json());

app.use("/api", loginRoute);
app.use("/api", verifyUserMiddleware, userAddRoute);
app.use("/api", verifyUserMiddleware, userUpdateRoute);
app.use("/api", verifyUserMiddleware, articleRoute);
app.use("/api", verifyUserMiddleware, categoryRoute);
app.use("/api", verifyUserMiddleware, versionRoute);
app.use("/api", verifyUserMiddleware, questionRoutes);
app.use("/api", verifyUserMiddleware, answerRoutes);
app.use("/api", verifyUserMiddleware, commentRoutes);
app.use("/api", verifyUserMiddleware, uploadRoute);
app.use("/api", verifyUserMiddleware, tagsRoutes);
app.use("/api", verifyUserMiddleware, searchRoutes);
app.use("/api", verifyUserMiddleware, companyRoutes);
app.use("/api", verifyUserMiddleware, folderRoutes);
app.use("/api", verifyUserMiddleware, fileRoutes);
app.use("/api", verifyUserMiddleware, noticeRoute);
app.use("/api", verifyUserMiddleware, taskRoutes);

app.use(
  "/Article/Images",
  verifyUserMiddleware,
  express.static(path.join(__dirname, "Article/Images"))
);

app.use(
  "/Article/Files",
  verifyUserMiddleware,
  express.static(path.join(__dirname, "Article/Files"))
);

app.use("/_root_/home/*", verifyFileUserMiddleware, function (req, res, next) {
  const requestedPath = req.params[0];
  const fullPath = path.join(__dirname, "_root_/home", requestedPath);
  express.static(fullPath)(req, res, next);
});

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
