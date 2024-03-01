const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("WIHDB", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});

module.exports = User;
