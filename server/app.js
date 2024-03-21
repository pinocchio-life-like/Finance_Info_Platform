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

const app = express();

// Middleware setup
const corsOptions = {
  origin: "http://localhost:4000",
  credentials: true,
};

app.use(cors());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routes setup
app.use("/api", userAddRoute);
app.use("/api", loginRoute);

app.use("/api", userUpdateRoute);
app.use("/api", articleRoute);
app.use("/api", categoryRoute);

// async function syncDatabase() {
//   try {
//     await sequelize.sync({alter: true,   }); //edit this as needed
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error("Error occurred during model synchronization:", error);
//   }
// }

// syncDatabase();

app.listen(5000, () => console.log("Server running on port 5000"));
