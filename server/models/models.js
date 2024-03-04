const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");
const bcrypt = require("bcrypt");
//define user mmodel
const User = sequelize.define("User", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
  userRole: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
});

const createUser = async (user) => {
  let users = {};
  console.log("from model");
  const { firstName, userName, password, userRole } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  users = await User.create({
    firstName,
    userName,
    password: hashedPassword,
    userRole,
  });

  return users;
};
const getUserByUserName = async (userName) => {
  return User.findOne({
    where: { userName: userName },
  });
};
//method to get all user
const getAllUsers = async () => {
  return User.findAll();
};
//update user
const updateUser = async (user) => {
  const { firstName, userName, password, userRole } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return User.update({firstName,userName,password:hashedPassword,userRole})

}
module.exports = {
  createUser,
  getUserByUserName,
  getAllUsers,
  updateUser
};
