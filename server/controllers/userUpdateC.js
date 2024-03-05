const {User }= require("../models/models");
const { updateUser } = require("../models/models");

const updateUsers = async (req, res) => {
  const { id } = req.params;
  const { firstName, userName, password, userRole } = req.body;

  try {
    // Check if the user exists before attempting to update
    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user using the updateUser function
    const updatedUser = await updateUser(id, {
      firstName,
      userName,
      password,
      userRole,
    });

    // Check if the update was successful
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUsers,
};
