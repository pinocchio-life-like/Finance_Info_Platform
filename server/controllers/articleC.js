const {
  Article,
  createArticle,
  updateArticle,
} = require("../models/articleModel");
const { User } = require("../models/userModel");

const articleC = async (req, res) => {
  const { articleTitle, articleContent, userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const article = await createArticle({
      articleTitle,
      articleContent,
      userId: userId,
    });

    res.json({
      message: "Article and category created",
      data: { article },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get Single Articel
const getMainArticleC = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);

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

const getDemoArticleC = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);

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

const updateArticleC = async (req, res) => {
  try {
    const { articleTitle, articleContent, userName } = req.body;
    const { id } = req.params;

    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedArticle = await updateArticle({
      articleId: id,
      articleTitle,
      articleContent,
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

module.exports = {
  articleC,
  updateArticleC,
  getMainArticleC,
  getDemoArticleC,
};
