const {
  addCategory,
  getCategories,
  addSubCategory,
  updateOrder,
  updateMainOrder,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.post("/category/addCategory", addCategory);
router.get("/category/getCategories", getCategories);
router.post("/categories/addSubCategories", addSubCategory);
router.put("/category/updateOrder", updateOrder);
router.put("/categories/updateMainOrder", updateMainOrder);

module.exports = router;
