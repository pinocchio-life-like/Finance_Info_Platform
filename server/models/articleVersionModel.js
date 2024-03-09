const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
// const   Article = require("./articleModel").  Article;

const ArticleVersion = sequelize.define("ArticleVersion", {
  articleVersionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: "articles",
      key: "articleId",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId",
    },
  },
  articleVersionContent: {
    type: DataTypes.TEXT,
    allowNull: false,
    require: true,
  },
  articleVersionTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  articleVersionCategory: {
    type: DataTypes.STRING,
  },
});

module.exports = {
  ArticleVersion,
};
