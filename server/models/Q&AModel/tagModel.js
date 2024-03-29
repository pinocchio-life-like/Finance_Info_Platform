const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');

const Tag = sequelize.define('Tag', {
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tag_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports ={Tag};