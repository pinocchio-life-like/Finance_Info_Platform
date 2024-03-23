const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
// const   Article = require("./articleModel").  Article;

const ArticleVersion = sequelize.define("ArticleVersions", {
  articleVersionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Articles",
      key: "articleId",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
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
const getallversionsOFAnArticle = async (id) => {
  const versions = await ArticleVersion.findAll({
    where: { articleId: id },
    attributes: [
      "articleVersionId",
      "articleVersionContent",
      "articleVersionTitle",
      "updatedAt",
      "createdAt",
    ],
    order: [["updatedAt", "DESC"]],
  });
  return versions;
};

module.exports = {
  ArticleVersion,
  getallversionsOFAnArticle,
};