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
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Notice };
