const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
const ArticleVersion = require("./articleVersionModel").ArticleVersion;
const Category=require('./categoryModel').Category

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
// Article.sync({alter:true}).then(()=>{
//   console.log("article table created");
// })

//function to create an article
const createArticle = async (article) => {
  try {
    const { articleTitle, articleContent, category, userId } = article;
    const user = await User.findByPk(article.userId);
    if (!user) throw new Error("User not found");

    const createdArticle = await Article.create({
      articleTitle,
      articleContent,
      category,
      userId,
    });

    const version1 = await ArticleVersion.create({
      articleVersionTitle: articleTitle,
      articleVersionContent: articleContent,
      articleVersionCategory: category,
      userId,
    });
  }
   catch (error) {
    console.error("Error creating article:", error);
  }
}
//function to get all  articles
const getAllArticles = async () => {
  try {
    return await Article.findAll({
      include: [User,Category],
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

//function to get all versions
const getAllVersions = async () => {
  try {
    const versions = await ArticleVersion.findAll({
      // where: {
      //   articleId,
      // },
      include: [
        // Include any additional associations you want to fetch (e.g., User)
        { model: User, attributes: ['userId', 'userName'] }
      ],
      // Order by creation date in descending order
      order: [['createdAt', 'DESC']], 
    });

    return versions;
  } catch (error) {
    console.log(error.message)
    throw error;
  }
};
module.exports = {
  Article,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getAllVersions
};
