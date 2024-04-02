const { updateUser, User } = require("../models/userModel");

const updateUsers = async (req, res) => {
  const { id } = req.params;
  const { firstName, userName, password, userRole } = req.body;

  try {
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await updateUser(id, {
      firstName,
      userName,
      password,
      userRole,
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUsers,
};
