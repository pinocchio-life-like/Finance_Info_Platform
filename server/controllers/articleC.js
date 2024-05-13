const {
  Article,
  getAllArticles,
  deleteArticle,
} = require("../models/articleModel");
const { createArticle, updateArticle } = require("../models/associations");
const { Category } = require("../models/categoryModel");
const { User } = require("../models/userModel");

const articleC = async (req, res) => {
  const { articleTitle, articleContent, parent_Id, userName } = req.body;

  try {
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parentCategory = await Category.findByPk(parent_Id);
    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    const order_within_parent =
      (await Category.count({ where: { parent_Id } })) + 1;

    const newCategory = await Category.create({
      category: articleTitle,
      parent_Id,
      order_within_parent,
    });

    const category_Id = newCategory.category_Id;

    const article = await createArticle({
      articleTitle,
      articleContent,
      category_Id: category_Id,
      userId: user.userId,
    });

    res.json({
      message: "Article and category created",
      data: { article, newCategory },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get Single Articel
const getSingleArticleC = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({ where: { category_Id: id } });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({
      message: "Article retrieved successfully",
      data: article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get First Articel
const getFirstArticleC = async (req, res) => {
  try {
    const article = await Article.findOne({ order: [["createdAt", "ASC"]] });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({
      message: "Article retrieved successfully",
      data: article.category_Id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//article getter
const getAllArticlesC = async (req, res) => {
  try {
    const articles = await getAllArticles();
    if (!articles) {
      res.json({ message: "No articles found" });
    } else {
      res.json({ message: "This are the existing Articles", data: articles });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateArticleC = async (req, res) => {
  try {
    const { articleTitle, articleContent, userName } = req.body;
    const { id } = req.params;

    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedArticle = await updateArticle({
      articleTitle,
      articleContent,
      category_Id: id,
      userId: user.userId,
    });

    return res.status(200).json({
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//detete article controller
const deleteArticleC = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await deleteArticle(id);

    if (!deletedArticle) {
      return res
        .status(404)
        .json({ message: "Article not found and can't delete" });
    }

    res.json({
      message: "Article deleted successfully",
      data: deletedArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  articleC,
  getAllArticlesC,
  updateArticleC,
  deleteArticleC,
  getSingleArticleC,
  getFirstArticleC,
};
