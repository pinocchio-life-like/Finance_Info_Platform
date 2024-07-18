const {
  taskPost,
  taskGetByUserIdC,
  taskUpdate,
  updateStatus,
  getTask,
  taskDelete,
} = require("../../controllers/NoticeController/taskController");
const router = require("express").Router();

router.post("/task", taskPost);
router.get("/tasks/:userName", taskGetByUserIdC);
router.get("/task/:id", getTask);
router.put("/task/:task_id", updateStatus);
router.put("/taskUpdate/:id", taskUpdate);
router.delete("/task/:id", taskDelete);

module.exports = router;
