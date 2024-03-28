const sequelize = require('../config/db.config');
const Article = require('./articleModel').Article; // Adjust paths as necessary
const User = require('./models').User;
const ArticleVersion = require('./articleVersionModel').ArticleVersion;


// Set up associations here

User.hasMany(Article, { foreignKey: 'userId' ,
  sourceKey: 'userId',});
Article.belongsTo(User, { foreignKey: 'userId' ,
  targetKey: 'userId',});

Article.hasMany(ArticleVersion, { foreignKey: 'articleId', sourceKey: 'articleId' });
ArticleVersion.belongsTo(Article, { foreignKey: 'articleId', targetKey: 'articleId' });
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
  sequelize,
  Article,
  User,
  ArticleVersion,
  createArticle,
  updateArticle,
  getallversionsOFAnArticle,
};
