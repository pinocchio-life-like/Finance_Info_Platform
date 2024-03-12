const logoutC = (req, res) => {
  console.log("logoutC");
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  logoutC,
};
