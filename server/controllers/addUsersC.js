const { createUser, getUserByUserName } = require("../models/models");

const createUsers = async (req, res) => {
  try {
    const newUser = req.body;

    // Check if the user with the same userName already exists
    const existingUser = await getUserByUserName(newUser.userName);

    if (existingUser) {
      res.json({
        message:
          "This username is already taken. Please choose another username.",
      });
    } else {
      // Create a new user if the username is not taken
      const user = await createUser(newUser);
      res.json({
        message: "User created successfully",
        data: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createUsers };
