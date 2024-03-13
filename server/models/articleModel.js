const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
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
  category_Id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Categories",
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
