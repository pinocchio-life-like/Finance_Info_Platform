const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./models").User;
// const   Article = require("./articleModel").  Article;

const ArticleVersion = sequelize.define("ArticleVersion", {
  articleVersionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: "articles",
      key: "articleId",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
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
  // versionNumber: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  articleVersionCategory: {
    type: DataTypes.STRING,
  },
});

// ArticleVersion.belongsTo(User, { foreignKey: "userId" });
// ArticleVersion.belongsTo( Article, { foreignKey: "articleId" });

// Use an async IIFE to sync the database
(async () => {
  try {
    await sequelize.authenticate();
    await ArticleVersion.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

module.exports = {
    ArticleVersion
};