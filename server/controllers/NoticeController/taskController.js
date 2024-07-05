const {
  assignTask,
  taskUpDate,
  getTaskByUserId,
  getAllTaskList,
} = require("../../models/NoticeBoardModel/association");

const taskPost = async (req, res) => {
  const { userId, task_due_date, task_status, task_description, task_name } =
    req.body;

  const task = await assignTask({
    userId,
    task_due_date,
    task_status,
    task_description,
    task_name,
  });

  if (!task) {
    return res.status(500).json({
      message: "something went wrong while posting task",
    });
  }

  return res.status(200).json({
    message: "task created",
    data: task,
  });
};

const taskGetByUserIdC = async (req, res) => {
  const task = await getTaskByUserId(req.params.id);

  if (!task) {
    return res.status(500).json({
      message: "something went wrong while fetching task",
    });
  }

  return res.status(200).json({
    message: "here is the task",
    data: task,
  });
};

const taskGetAll = async (req, res) => {
  const task = await getAllTaskList();

  if (!task) {
    return res.status(500).json({
      message: "something went wrong while fetching task",
    });
  }

  return res.status(200).json({
    message: "here is the task",
    data: task,
  });
};

const taskUpdate = async (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;

  const task = await taskUpDate(taskId, updatedData);

  if (!task) {
    return res.status(500).json({
      message: "Something went wrong while updating task",
    });
  }

  return res.status(200).json({
    message: "Task updated",
    data: task,
  });
};

module.exports = { taskPost, taskGetByUserIdC, taskGetAll, taskUpdate };
