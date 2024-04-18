const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");

const Tag = sequelize.define("Tag", {
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tag_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  useCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

const getAllTags = async () => {
  return await Tag.findAll();
};

module.exports = { Tag, getAllTags };
