const {
  Article,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getAllVersions

} = require("../models/articleModel");

const articleC = async (req, res) => {
  const { articleTitle, articleContent, category, userId } = req.body;
  const article = await createArticle({
    articleTitle,
    articleContent,
    category,
    userId,
  });
  
  if (!article) {
    res.json({ message: "Article not created" });
  } else {
    res.json({
      message: "Article created",
      data: article,
    });
  }
};
//article getter
const getAllArticlesC = async (req, res) => {
 try {
  const articles = await getAllArticles();
  if (!articles) {
    res.json({ message: "No articles found" });
  } 
  else {
    res.json({ message: "This are the existing Articles", 
    data: articles 
  });
  }
  
 } catch(error) {
  
  res.status(500).json({ message: "Internal server error" });

 }
};
const updateArticleC = async (req, res) => {
  try {
      const { articleTitle, articleContent, category } = req.body;
      const { id } = req.params;

      const article = await Article.findByPk(id);

      if (!article) {
          return res.status(404).json({ message: "Article not found and can't update" });
      }

      const updatedArticle = await updateArticle({articleTitle, articleContent, category})

      return res.status(200).json({
          message: "Article updated successfully",
          data: updatedArticle
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
      return res.status(404).json({ message: "Article not found and can't delete" });
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
//version controller function
const getAllVersionsC = async (req, res) => {
  try {
    // const { id } = req.params;
    
    const versions = await getAllVersions();

    if (!versions) {
      res.json({ message: "No versions found" });
    } 
    else
     {
      res.json({ 
        message: "This are the existing versions", 
        data: versions 
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error fron version" });
  }
};
module.exports = {
   articleC, 
   getAllArticlesC,
updateArticleC,
deleteArticleC,
getAllVersionsC
 };
