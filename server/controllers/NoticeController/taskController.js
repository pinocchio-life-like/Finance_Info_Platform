const {
  taskUpDate,
  getTaskByUserId,
  getAllTaskList,
  User,
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
  try {
    const { userName } = req.params;

    const tasksForUser = await Task.findAll({
      include: [
        {
          model: User,
          as: "Users",
          where: { userName: userName },
          through: {
            attributes: ["status"],
          },
        },
      ],
    });

    if (!tasksForUser.length) {
      return res.status(200).json({ data: [] });
    }

    // Map over tasksForUser to construct a new response
    const modifiedTasks = tasksForUser.map((task) => {
      // Assuming task is a sequelize model instance, use task.get({ plain: true }) to get a plain object
      const taskPlain = task.get({ plain: true });
      const taskUserStatus = taskPlain.Users[0]?.taskUser?.status; // Safely access status

      // Exclude Users from the response and include taskUserStatus
      delete taskPlain.Users; // Remove Users array
      return { ...taskPlain, taskUserStatus }; // Add taskUserStatus at the same level as task attributes
    });

    return res.status(200).json({ data: modifiedTasks });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching tasks",
      error: error.message,
    });
  }
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
