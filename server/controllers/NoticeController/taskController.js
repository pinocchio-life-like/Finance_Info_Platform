const { Sequelize, Op } = require("sequelize");
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

    const user = await User.findOne({
      where: { userName: userName },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasksForUser = await Task.findAll({
      include: [
        {
          model: User,
          through: {
            attributes: [],
          },
          through: {
            attributes: ["status"],
          },
        },
      ],
      where: {
        [Op.or]: [
          Sequelize.literal(`EXISTS (
            SELECT 1
            FROM \`taskusers\` AS tu
            INNER JOIN \`Users\` AS u ON u.\`userId\` = tu.\`UserUserId\`
            WHERE tu.\`taskTaskId\` = Task.\`task_id\`
            AND u.\`userId\` = ${user.userId}
          )`),
          { userName: userName }, // Condition to include tasks created by the user
        ],
      },
    });

    if (!tasksForUser.length) {
      return res.status(200).json({ data: [] });
    }

    const modifiedTasks = tasksForUser.map((task) => {
      const taskPlain = task.get({ plain: true });
      const matchingUser = taskPlain.Users.find(
        (u) => u.userId === user.userId
      );
      const taskUserStatus =
        matchingUser?.taskUser?.status || taskPlain.Users[0]?.taskUser?.status;
      return { ...taskPlain, taskUserStatus };
    });

    return res.status(200).json({ data: modifiedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
    const [updated] = await Task.update(
      { task_name, task_description, task_due_date },
      { where: { task_id: taskId } }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await Task.findByPk(taskId);

    if (users.length === 0) {
      const allUsers = await User.findAll({
        attributes: ["userId"],
      });
      const userIds = allUsers.map((user) => user.userId);
      console.log("No users provided, associating with all users", userIds);
      await task.setUsers(userIds);
    } else {
      const userIds = users.map((user) =>
        user.hasOwnProperty("value") ? user.value : user
      );
      console.log("Associating with provided users", userIds);
      await task.setUsers(userIds);
    }
    return res.status(200).json({
      message: "Task updated successfully",
      data: task,
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

const generalStatus = async (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;

  const task = await Task.update(
    { task_status: status },
    {
      where: { task_id },
    }
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  await TaskUser.update(
    { status: status },
    {
      where: {
        taskTaskId: task_id,
      },
    }
  );

  return res.status(200).json({
    message: "Task status updated successfully",
  });
};

module.exports = {
  taskPost,
  taskGetByUserIdC,
  taskUpdate,
  updateStatus,
  generalStatus,
  getTask,
  taskDelete,
};
