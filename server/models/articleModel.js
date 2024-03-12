const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
const ArticleVersion = require("./articleVersionModel").ArticleVersion;

const Article = sequelize.define("article", {
  articleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  articleTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  articleContent: {
    type: DataTypes.TEXT,
    allowNull: false,
    require: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId",
    },
  },
  category_Id: {
    type: DataTypes.INTEGER,
    references: {
      model: "categories",
      key: "category_Id",
    },
  },
});

// Define the foreign key relationship
Article.belongsTo(User, { foreignKey: "userId" });
Article.hasMany(ArticleVersion, {
  foreignKey: "articleId",
  sourceKey: "articleId",
});
ArticleVersion.belongsTo(Article, {
  foreignKey: "articleId",
  targetKey: "articleId",
});

//function to create an article
const createArticle = async (article) => {
  try {
    const { articleTitle, articleContent, category_Id, userId } = article;
    const createdArticle = await Article.create({
      articleTitle,
      articleContent,
      category_Id,
      userId,
    });

    const version1 = await ArticleVersion.create({
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleVersionCategory: category_Id,
      userId,
    });

    return { createdArticle, version1 };
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};
//function to get all  articles
const getAllArticles = async () => {
  try {
    return await Article.findAll({
      include: [User],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.error("Error getting all articles:", error);
    throw error;
  }
};
// function to update the articles
const updateArticle = async (articleId, articleData) => {
  try {
    const { articleTitle, articleContent, category, userId } = articleData;
    const article = await Article.findByPk(articleId);
    if (!article) throw new Error("Article not found");

    const updatedArticle = await article.update({
      articleTitle,
      articleContent,
      category,
      userId,
    });

    const version = await ArticleVersion.create({
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleVersionCategory: category,
      articleId,
      userId,
    });
    return { updatedArticle, version };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

//handling the dettting of an article
const deleteArticle = async (articleId) => {
  try {
    const article = await Article.findByPk(articleId);
    if (!article) throw new Error("Article not found");

    return await article.destroy();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

module.exports = {
  Article,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
};
