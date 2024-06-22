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
    type: DataTypes.TEXT("long"),
  },
  // userId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: "users",
  //     key: "userId",
  //   },
  // },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company_Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { Notice };
