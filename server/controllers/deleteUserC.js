const { deleteUser } = require("../models/userModel");
const deleteUserC = async (req, res) => {
  const id = req.params.id;
  const user = await deleteUser(id);
  if (!user) {
    res.status(400).json({ message: "user not found" });
  }
  res.status(200).json({ message: "user deleted", data: user });
};
module.exports = { deleteUserC };
