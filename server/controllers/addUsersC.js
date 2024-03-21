const {
  createUser,
  getUserByUserName,
  getAllUsers,
  destroy,
} = require("../models/models");

const createUsers = async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser = await getUserByUserName(newUser.userName);
    if (existingUser) {
      res.status(409).json({
        message:
          "This username is already taken. Please choose another username.",
      });
    } else {
      const user = await createUser(newUser);
      res.status(201).json({
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

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    const usersWithNullPassword = users.map((user) => {
      return { ...user.dataValues, password: null };
    });
    res.status(200).json({
      message: "Users fetched successfully",
      data: usersWithNullPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteUsers = async (req, res) => {
  const { userIds } = req.body;
  try {
    await destroy(userIds);
    res.status(200).json({
      message: "Users deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createUsers, getUsers, deleteUsers };
