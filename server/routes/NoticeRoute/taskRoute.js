const {
  taskPost,
  taskGetByUserIdC,
  taskUpdate,
  updateStatus,
  getTask,
} = require("../../controllers/NoticeController/taskController");
const router = require("express").Router();

router.post("/task", taskPost);
router.get("/tasks/:userName", taskGetByUserIdC);
router.get("/task/:id", getTask);
router.put("/task/:task_id", updateStatus);
router.put("/taskUpdate/:id", taskUpdate);

module.exports = router;
