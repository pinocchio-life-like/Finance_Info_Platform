const {
  articleC,
  getAllArticlesC,
  updateArticleC,
  deleteArticleC,
  getSingleArticleC,
  getFirstArticleC,
} = require("../controllers/articleC");
const router = require("express").Router();

router.post("/article", articleC);
router.get("/article/:id", getSingleArticleC);
router.get("/articles", getAllArticlesC);
router.get("/articles/first", getFirstArticleC);
router.put("/article/:id", updateArticleC);
router.delete("/article/:id", deleteArticleC);

module.exports = router;
