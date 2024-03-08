require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");

//cors
const cors = require("cors");
// const User  = require("./config/db.config");
const userAddRoute = require("./routes/usersR");
const loginRoute = require("./routes/userLoginR");

const userUpdateRoute = require("./routes/userUpdateR");
const articleRoute = require("./routes/articleR");
const getUserR=require('./routes/getUserR')

const app = express();

// Middleware setup
const corsOptions = {
  origin: "http://localhost:4000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routes setup
app.use("/api", userAddRoute);
app.use("/api", loginRoute);

app.use("/api", userUpdateRoute);
app.use("/api", articleRoute);
app.use('/api',getUserR)
// app.use('/api',articleRoute)

// app.get("/", async (req, res) => {
//   const user = await User.create({
//     firstName: "zena",
//     userName: "zena",
//     password: "123",
//     userRole: "admin",
//   });

//   res.json(user)
// });
app.listen(5000, () => console.log("Server running on port 5000"));
