const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getAllUsers } = require("../models/models");
const secretKey = process.env.SECRET_KEY;

const userloginC = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const users = await getAllUsers();

    // Check if any user with the given username exists
    const user = users.find((user) => user.userName === userName);

    if (user) {
      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        //data to be send to the client side
        const payload = {
          // userId:user.userId,
          userName: user.userName,
          userRole: user.userRole,
          firstName: user.firstName,
        };
        // Generate a JWT token
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        // res.cookie('token', token, { httpOnly: true });
        res.json({
          message: "Login success",
          token: token,
        });
      } else {
        res.json({
          message: "Incorrect password",
        });
      }
    } else {
      res.json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  userloginC,
};
