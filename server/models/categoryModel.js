const sequelize = require("../config/db.config");
const { DataTypes } = require("sequelize");
const Article = require("./articleModel").Article;

const Category = sequelize.define(
  'Category',
  {
    category_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent_Id: {
      type: DataTypes.INTEGER,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_within_parent: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['parent_Id', 'order_within_parent'],
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
// Category.sync({alter:true}).then(()=>{
//   console.log("category table created");
// })
const createCategory=async(cat)=>{
  const{category,
    parent_Id,
    order,
    order_within_parent,}=cat
  const newCategory = await Category.create({
    category,
    parent_Id,
    order,
    order_within_parent,
  });
  return newCategory

}
    
module.exports = { 
  Category,
  createCategory};
