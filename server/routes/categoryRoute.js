const {
  addCategory,
  getCategories,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.post("/category/addCategory", addCategory);
router.post("/category/getCategories", getCategories);

module.exports = router;
