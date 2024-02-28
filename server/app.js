const express = require("express");
//cors
const cors = require("cors");
const { user } = require("./models/User"); // Incorrect for model classes

const app = express();

//addmidlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", user);
app.listen(5000, () => console.log("Server running on port 5000"));
