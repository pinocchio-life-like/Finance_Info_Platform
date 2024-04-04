const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
// const Article= require("./articleModel").Article;

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
    type: DataTypes.TEXT("long"),
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
// Article.hasMany(ArticleVersion, {
//   foreignKey: "articleId",
//   sourceKey: "articleId",
// });
// ArticleVersion.belongsTo(Article, {
//   foreignKey: "articleId",
// });

// const getallversionsOFAnArticle = async (id) => {
//   const article = await Article.findOne({ where: { category_Id: id } });

//   const versions = await ArticleVersion.findAll({
//     where: { articleId: article.articleId },
//     attributes: [
//       "articleVersionId",
//       "articleVersionContent",
//       "articleVersionTitle",
//       "updatedAt",
//       "createdAt",
//     ],
//     order: [["updatedAt", "DESC"]],
//   });
//   return versions;
// };
const getVersionById = async (id) => {
  const version = await ArticleVersion.findOne({
    where: { articleVersionId: id },
    attributes: [
      "articleVersionId",
      "articleVersionContent",
      "articleVersionTitle",
      "updatedAt",
      "createdAt",
    ],
  });
  return version;
};
module.exports = {
  ArticleVersion,
  // getallversionsOFAnArticle,
  getVersionById,
};
