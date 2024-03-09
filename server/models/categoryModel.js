const sequelize = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");
const Article = require("./articleModel").Article;

const Category = sequelize.define(
  "category",
  {
    category_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
      require: true,
    },
    parent_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      require: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      require: true,
      unique: true,
    },
    order_within_parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["parent_Id", "order_within_parent"],
      },
    ],
  }
);

Category.belongsTo(Category, { as: "Parent", foreignKey: "parent_Id" });
Category.hasMany(Category, { as: "Children", foreignKey: "parent_id" });
Category.hasOne(Article, {
  foreignKey: "category_Id",
  sourceKey: "category_Id",
});
Article.belongsTo(Category, {
  foreignKey: "category_Id",
  targetKey: "category_Id",
});

Category.sync()
  .then(() => {
    console.log("Category table has been synchronized successfully.");
  })
  .catch((error) => {
    console.error(
      "Error occurred during Category table synchronization:",
      error
    );
  });

module.exports = { Category };
