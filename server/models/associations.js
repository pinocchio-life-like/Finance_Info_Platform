const Article = require('./articleModel'); // Adjust paths as necessary
const User = require('./models');
const ArticleVersion = require('./articleVersionModel');
const sequelize = require('../config/db.config');

// Set up associations here
Article.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Article, { foreignKey: 'userId' });

Article.hasMany(ArticleVersion, { foreignKey: 'articleId', sourceKey: 'articleId' });
ArticleVersion.belongsTo(Article, { foreignKey: 'articleId', targetKey: 'articleId' });

module.exports = {
  sequelize,
  Sequelize,
  Article,
  User,
  ArticleVersion,
};
