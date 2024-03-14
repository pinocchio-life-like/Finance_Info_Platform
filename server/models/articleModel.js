const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./userModel").User;
const ArticleVersion = require("./articleVersionModel").ArticleVersion;

const Article = sequelize.define("Articles", {
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
      model: "Users",
      key: "userId",
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
    const { articleTitle, articleContent, userId } = article;
    const createdArticle = await Article.create({
      articleTitle,
      articleContent,
      userId,
    });

    const version = await ArticleVersion.create({
      articleId: createdArticle.articleId,
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      userId,
    });

    return { createdArticle, version };
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

// function to update the articles
const updateArticle = async (data) => {
  try {
    const { articleTitle, articleContent, articleId, userId } = data;

    const article = await Article.findByPk(articleId);

    if (!article) {
      return res
        .status(404)
        .json({ message: "Article not found and can't update" });
    }

    const updatedArticle = await article.update({
      articleTitle,
      articleContent,
      userId,
    });

    const version = await ArticleVersion.create({
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleId: updatedArticle.articleId,
      userId,
    });

    return { updatedArticle, version };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

module.exports = {
  Article,
  createArticle,
  updateArticle,
};
