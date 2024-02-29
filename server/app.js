
require("dotenv").config();
const express = require("express");
//cors
const cors = require("cors");
const User  = require("./config/db.config"); // Incorrect for model classes
const router=require('./routes/usersR')
const loginRoute = require('./routes/userLoginR');

const app = express();

// addmidlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//add routes
app.use('/api',router);
//loginroute
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
