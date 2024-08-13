const sequelize = require("../config/db.config");
const { Folder } = require("./FtpModel/FolderModel");
const { FolderUser } = require("./FtpModel/FolderUserModel");
const Company = require("./CompanyModel/CompanyModel").Company;
const Article = require("./articleModel").Article; // Adjust paths as necessary
const User = require("./userModel").User;
const ArticleVersion = require("./articleVersionModel").ArticleVersion;

// Set up associations here

Company.hasMany(User, { foreignKey: "company_Id", sourceKey: "company_Id" });
User.belongsTo(Company, { foreignKey: "company_Id", targetKey: "company_Id" });

User.hasMany(Article, { foreignKey: "userId", sourceKey: "userId" });
Article.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

Article.hasMany(ArticleVersion, {
  foreignKey: "articleId",
  sourceKey: "articleId",
});
ArticleVersion.belongsTo(Article, {
  foreignKey: "articleId",
  targetKey: "articleId",
});

User.belongsToMany(Folder, { through: FolderUser, foreignKey: "userId" });

const createArticle = async (article) => {
  try {
    const { articleTitle, articleContent, category_Id, userId } = article;
    const createdArticle = await Article.create({
      articleTitle,
      articleContent,
      category_Id,
      userId,
    });

    const version = await ArticleVersion.create({
      articleId: createdArticle.articleId,
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleVersionCategory: category_Id,
      userId,
    });

    return { createdArticle, version };
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};
const updateArticle = async (data) => {
  try {
    const { articleTitle, articleContent, category_Id, userId } = data;

    const article = await Article.findOne({
      where: { category_Id: category_Id },
    });

    if (!article) {
      return res
        .status(404)
        .json({ message: "Article not found and can't update" });
    }

    const updatedArticle = await article.update({
      articleTitle,
      articleContent,
      category_Id,
      userId,
    });

    const version = await ArticleVersion.create({
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleVersionCategory: category_Id,
      articleId: updatedArticle.articleId,
      userId,
    });

    return { updatedArticle, version };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};
const getallversionsOFAnArticle = async (id) => {
  const article = await Article.findOne({ where: { category_Id: id } });

  const versions = await ArticleVersion.findAll({
    where: { articleId: article.articleId },
    attributes: [
      "articleVersionId",
      "userId",
      "articleVersionContent",
      "articleVersionTitle",
      "updatedAt",
      "createdAt",
    ],
    include: [
      {
        model: User,
        attributes: ["userName"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  return versions;
};

const getUserByUserName = async (userName) => {
  return User.findOne({
    where: { userName: userName },
    include: [
      {
        model: Company,
        attributes: ["company_Name"],
      },
    ],
  });
};

module.exports = {
  sequelize,
  Company,
  Article,
  User,
  ArticleVersion,
  createArticle,
  updateArticle,
  getallversionsOFAnArticle,
  getUserByUserName,
};
