const router = require("express").Router();
const { searchAllC } = require("../controllers/searchController");

router.get("/searchAll", searchAllC);

module.exports = router;
