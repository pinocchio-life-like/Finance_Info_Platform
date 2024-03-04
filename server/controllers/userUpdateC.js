//user update controller function

const User = require("../models/models");
const { updateUser } = require("../models/models");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, userName, password, userRole } = req.body;

  try {
    const user = await User.findByPk(id);
    const updateuser = await updateUser({
      firstName,
      userName,
      password,
      userRole,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.userName = userName;
    user.password = password;
    user.userRole = userRole;

    await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully", data: updateuser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUser,
};
