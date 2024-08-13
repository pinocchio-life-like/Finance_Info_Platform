const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");
const bcrypt = require("bcryptjs");
const ArticleVersion = require("./articleVersionModel").ArticleVersion;
const { Op } = require("sequelize");
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
  company_Id: {
    type: Sequelize.STRING,
    references: {
      model: "Companies",
      key: "company_Id",
    },
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
// User.sync({ force

//   : true }).then(() => {
//   console.log("users table created");
// })
const createUser = async (user) => {
  let users = {};
  const { firstName, userName, password, userRole, company_Id } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  users = await User.create({
    firstName,
    userName,
    password: hashedPassword,
    userRole,
    company_Id,
  });

  return users;
};

//method to get all user
const getAllUsers = async () => {
  return User.findAll();
};

const getUserById = async (id) => {
  const usebyId = await User.findOne({
    where: { userId: id },
  });
  return usebyId;
};

//update user
const updateUser = async (id, userData) => {
  const { firstName, userName, password, userRole, company_Id } = userData;
  try {
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateData = { firstName, userName, userRole, company_Id };
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
const destroy = async (userIds) => {
  try {
    await User.destroy({
      where: { userId: { [Op.in]: userIds } },
    });
  } catch (error) {
    throw error;
  }
};

const getUserByUserName = async (userName) => {
  return User.findOne({
    where: { userName: userName },
  });
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  destroy,
  User,
  getUserById,
  getUserByUserName,
};
