const { addCategory } = require("../controllers/categoryController");
const router = require("express").Router();

router.post("/category/addCategory", addCategory);

module.exports = router;
