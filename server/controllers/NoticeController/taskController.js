const {
  assignTask,
  taskUpDate,
  getTaskByUserId,
  getAllTaskList,
} = require("../../models/NoticeBoardModel/association");
const { Task } = require("../../models/NoticeBoardModel/taskModel");

const taskPost = async (req, res) => {
  try {
    const { task_name, task_description, task_due_date, userName, users } =
      req.body;

    // Create the task
    const task = await Task.create({
      task_name,
      task_description,
      task_due_date,
      userName,
    });

    // If there are users to associate with the task
    if (users && users.length) {
      // Sequelize automatically provides this method to associate users with the task
      await task.addUsers(users);
    }
    // Respond with success message and the created task
    return res.status(200).json({
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "Something went wrong while posting task",
    });
  }
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
