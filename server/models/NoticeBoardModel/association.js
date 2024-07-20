const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const sequelize = require("../../config/db.config");

const Notice = require("./noticeModel").Notice;
const User = require("../userModel").User;
const Task = require("./taskModel").Task;
const Company = require("../CompanyModel/CompanyModel").Company;

// The Join model with custom field status
const TaskUser = sequelize.define("taskUser", {
  status: {
    type: Sequelize.STRING,
    defaultValue: "pending",
  },
});

Task.belongsToMany(User, { through: TaskUser });
User.belongsToMany(Task, { through: TaskUser });

// The association between the Company and Notice models
Company.belongsToMany(Notice, { through: "companyNotice" });
Notice.belongsToMany(Company, { through: "companyNotice" });

const postNotice = async (data) => {
  // const {noticeDescription,noticeTitle,userId,companyId}=data
  return await Notice.create(data);
};
const getNotice = async () => {
  return await Notice.findAll();
};
const getNoticeById = async (id) => {
  return await Notice.findOne({ where: { noticeId: id } });
};
const deleteNotice = async (id) => {
  return await Notice.destroy({ where: { noticeId: id } });
};
const findNoticeBYUserId = async (id) => {
  return await Notice.findAll({ where: { userId: id } });
};
const assignTask = async (data) => {
  const { userId, task_due_date, task_status, task_description, task_name } =
    data;
  // Count the number of tasks assigned to the user with status other than 'Completed'
  const incompleteTasksCount = await Task.count({
    where: {
      userId: userId,
      task_status: {
        [Op.not]: "Completed",
      },
    },
  });

  // Check if the count is less than or equal to 2
  if (incompleteTasksCount <= 2) {
    // Create the new task
    const task = await Task.create(data);
    return task;
  } else {
    throw new Error(
      "Cannot assign task. The user has more than 2 incomplete tasks."
    );
  }
};
const taskUpDate = async (id, updatedData) => {
  try {
    const [affectedRows] = await Task.update(updatedData, {
      where: { task_id: id },
    });
    return affectedRows > 0 ? await Task.findByPk(id) : null;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};
const getTaskByUserId = async (data) => {
  return await Task.findAll({ where: { userId: data } });
};
const getAllTaskList = async () => {
  return await Task.findAll();
};
module.exports = {
  Notice,
  User,
  Company,
  TaskUser,
  postNotice,
  getNotice,
  getNoticeById,
  deleteNotice,
  findNoticeBYUserId,
  assignTask,
  taskUpDate,
  getTaskByUserId,
  getAllTaskList,
};
