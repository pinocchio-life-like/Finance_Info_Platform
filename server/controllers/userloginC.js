const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getAllUsers } = require("../models/models");
const secretKey = process.env.SECRET_KEY;
const refresh_key = process.env.REFRESH_TOKEN_SECRET;

//function to generate refresh token
const generateRefreshToken = (user) => {
  const payload = {
    userName: user.userName,
    userRole: user.userRole,
    firstName: user.firstName,
  };
  return jwt.sign(payload, refresh_key, {
    expiresIn: "7d",
  });
};
const userloginC = async (req, res) => {
  try {
    const { username, password } = req.body.data;
    const users = await getAllUsers();

    // Check if any user with the given username exists
    const user = users.find((user) => user.userName === username);

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
        // Generate accesstoken
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

        // Generate refresh token
        const refreshToken = generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.json({
          message: "Login success",
          payload: payload,
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect password",
        });
      }
    } else {
      res.status(404).json({
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
//a function to refresh the access token by using the refresh token
const refreshTokenC = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refreshToken:", refreshToken);

    // Verify the refresh token
    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refresh_key);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    console.log("Decoded refreshToken:", decoded);

    // If valid, generate a new access token and send it to the client
    const payload = {
      userName: decoded.userName,
      firstName: decoded.firstName,
      userRole: decoded.userRole,
    };

    const newAccessToken = jwt.sign(payload, secretKey, { expiresIn: "4h" });

    res.status(200).json({
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  userloginC,
  refreshTokenC,
  // userUpadateC,
};
