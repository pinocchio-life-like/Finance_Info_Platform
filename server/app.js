const express = require("express");
const User = require("./models"); // assuming your User model is exported from a 'models' directory

const app = express();
app.use(express.json());

// Create a user
app.get("/", async (req, res) => {
  try {
    const newUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
