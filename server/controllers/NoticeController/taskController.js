const { User, TaskUser } = require("../../models/NoticeBoardModel/association");
const { Task } = require("../../models/NoticeBoardModel/taskModel");

const taskPost = async (req, res) => {
  try {
    const { task_name, task_description, task_due_date, userName, users } =
      req.body;

    const task = await Task.create({
      task_name,
      task_description,
      task_due_date,
      userName,
    });

    if (users && users.length) {
      await task.addUsers(users);
    }
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

const getTask = async (req, res) => {
  const task = await Task.findOne({
    where: { task_id: req.params.id },
  });

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

const updateStatus = async (req, res) => {
  const { task_id } = req.params;
  const { status, userName } = req.body; // Use userName from req.body

  try {
    // Find the User instance by userName to get the user_id
    const user = await User.findOne({
      where: { userName: userName },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Now that we have the user_id, find the TaskUser instance
    const taskUser = await TaskUser.findOne({
      where: {
        taskTaskId: task_id,
        userUserId: user.userId, // Use the found user's id
      },
    });

    if (!taskUser) {
      return res.status(404).json({
        message: "TaskUser not found",
      });
    }

    // Update the status
    taskUser.status = status;
    await taskUser.save();

    return res.status(200).json({
      message: "TaskUser status updated successfully",
      data: taskUser,
    });
  } catch (error) {
    console.error("Error updating TaskUser status:", error);
    return res.status(500).json({
      message: "Something went wrong while updating TaskUser status",
    });
  }
};
const taskUpdate = async (req, res) => {
  const taskId = req.params.id;
  const { task_name, task_description, task_due_date, users } = req.body;

  try {
    let task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task details
    await task.update({
      task_name,
      task_description,
      task_due_date,
    });

    // If users are provided, update the association
    if (users) {
      // Assuming `users` is an array of user IDs
      // First, find all associated users
      const currentUsers = await task.getUsers();
      const currentUserIds = currentUsers.map((user) => user.id);

      // Determine users to add and to remove
      const usersToAdd = users.filter(
        (userId) => !currentUserIds.includes(userId)
      );
      const usersToRemove = currentUserIds.filter(
        (userId) => !users.includes(userId)
      );

      // Update associations
      if (usersToAdd.length) await task.addUsers(usersToAdd);
      if (usersToRemove.length) await task.removeUsers(usersToRemove);
    }

    // Fetch the updated task details along with associated users
    const updatedTask = await Task.findByPk(taskId, { include: [User] });

    return res.status(200).json({
      message: "Task updated",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

const taskDelete = async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({
    where: { task_id: id },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  await task.destroy();

  return res.status(200).json({
    message: "Task deleted successfully",
  });
};

module.exports = {
  taskPost,
  taskGetByUserIdC,
  taskUpdate,
  updateStatus,
  getTask,
  taskDelete,
};
