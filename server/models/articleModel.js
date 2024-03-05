const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
// const ArticleVersion = require("./articleVersionModel").ArticleVersion;
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
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  // articleAuthor: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     require: true,
  // },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId",
    },
  },
  category: {
    type: DataTypes.STRING(255),
  },
});
// Define the foreign key relationship
Article.belongsTo(User, { foreignKey: "userId" });
// Article.hasMany(ArticleVersion, { foreignKey: "articleId" });

(async () => {
  try {
    // Sync models
    await sequelize.authenticate();
    await User.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

//function to create an article
const createArticle = async (article) => {
  const { articleTitle, articleContent, category, userId } = article;
  // Check if the user with the given userId exists
  const user = await User.findByPk(userId);
  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }
  // Create the article with the associated user
  const createdArticle = await Article.create({
    articleTitle,
    articleContent,
    category,
    userId,
  });

  return createdArticle;
};
//function to get all  articles
const getAllArticles = async () => {
  return Article.findAll({
    include: [User],
    order: [["createdAt", "DESC"]],
  });
};
// function to update the articles
const updateArticle = async (articleId, articleData) => {
  const { articleTitle, articleContent, category } = articleData;

  try {
    // Find the article by its primary key
    const article = await Article.findByPk(articleId);

    // If the article is not found, throw an error
    if (!article) {
      throw new Error("Article not found");
    }

    // Update the article with the provided data
    const updatedArticle = await article.update({
      articleTitle,
      articleContent,
      category,
    });

    return updatedArticle;
  } catch (error) {
    throw error;
  }
};
//handling the dettting of an article
const deleteArticle = async (articleId) => {
  try {
    // Find the article by its primary key
    const article = await Article.findByPk(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    // Delete the article
    const deletedArticle = await article.destroy();

    if (!deletedArticle) {
      throw new Error("Failed to delete article");
    }

    return deletedArticle;
  } catch (error) {
    // Log the error or handle it in a way appropriate for your application
    console.error("Error deleting article:", error.message);
    // Rethrow the error to be caught by the calling function or middleware
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
