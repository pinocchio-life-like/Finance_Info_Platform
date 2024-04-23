const router = require("express").Router();
const { getTags } = require("../../controllers/Q&AControllers/tagsController");
router.get("/tags/getall", getTags);
module.exports = router;
