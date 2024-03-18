const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./userModel").User;
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
});
const getallversionsOFAnArticle=async(Id)=>{
  const versionOfArticle=await ArticleVersion.findAll()
  return versionOfArticle
}
module.exports = {
  ArticleVersion,
  getallversionsOFAnArticle
};
