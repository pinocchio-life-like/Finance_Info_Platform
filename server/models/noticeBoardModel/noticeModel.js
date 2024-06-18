const { DataTypes } = require("sequelize");
const Sequelize = require("../../config/db.config");

const Notice = Sequelize.define("notice", {
  noticeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  noticeTitle: {
    type: DataTypes.STRING,
  },
  noticeDescription: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId",
    },
  },
  company_Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { Notice };
