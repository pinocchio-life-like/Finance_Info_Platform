const {
  taskPost,
  taskGetByUserIdC,
  taskGetAll,
  taskUpdate,
} = require("../../controllers/NoticeController/taskController");
const router = require("express").Router();

router.post("/task", taskPost);
router.get("/tasks/:userName", taskGetByUserIdC);
router.get("/task", taskGetAll);
router.put("/task/:id", taskUpdate);

module.exports = router;
