const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");
const bcrypt = require("bcrypt");
const ArticleVersion = require("./articleVersionModel").ArticleVersion;
//define user mmodel
const User = sequelize.define("Users", {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
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

// User.hasMany(ArticleVersion,{foreignKey:'userId'})
User.hasMany(ArticleVersion, {
  foreignKey: "userId",
  sourceKey: "userId",
});
ArticleVersion.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});

const createUser = async (user) => {
  let users = {};
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
const updateUser = async (id, userData) => {
  const { firstName, userName, password, userRole } = userData;
  try {
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateData = { firstName, userName, userRole };
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const [rowsUpdated, updatedUsers] = await User.update(updateData, {
      where: { userId: id },
      returning: true,
    });

    if (rowsUpdated === 0) {
      throw new Error("User not found or no updates made");
    }

    const updatedUser = updatedUsers[0];

    return { updatedUser, user: await User.findByPk(id) };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUserName,
  getAllUsers,
  updateUser,
  User,
};
