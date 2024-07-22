const { getUserById } = require("../models/userModel");
const { getUserByUserName } = require("../models/associations");

const getSingleUserController = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  return res.status(200).json({
    data: user,
    message: "user found",
  });
};

const getUserByUsernameController = async (req, res) => {
  const { userName } = req.params;
  const user = await getUserByUserName(userName);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  return res.status(200).json({
    data: user,
    message: "user found",
  });
};

module.exports = {
  getSingleUserController,
  getUserByUsernameController,
};
