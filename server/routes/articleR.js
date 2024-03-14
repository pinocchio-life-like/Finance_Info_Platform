const {
  articleC,
  updateArticleC,
  getMainArticleC,
  getDemoArticleC,
} = require("../controllers/articleC");
const router = require("express").Router();

router.post("/article/create", articleC);
router.get("/article/main/:id", getMainArticleC);
router.get("/article/demo", getDemoArticleC);
router.put("/article/main/:id", updateArticleC);

module.exports = router;
