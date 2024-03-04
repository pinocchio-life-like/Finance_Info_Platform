
require("dotenv").config();
const express = require("express");
//cors
const cors = require("cors");
// const User  = require("./config/db.config"); 
const userAddRoute=require('./routes/usersR')
const loginRoute = require('./routes/userLoginR');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routes setup
app.use('/api',userAddRoute);
app.use('/api',loginRoute)

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
