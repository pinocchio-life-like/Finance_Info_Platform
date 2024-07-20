const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");

const Task = sequelize.define("task", {
  task_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  task_name: {
    type: DataTypes.STRING,
  },
  task_description: {
    type: DataTypes.TEXT("long"),
  },
  task_status: {
    type: DataTypes.ENUM,
    values: ["pending", "completed", "overdue"],
    defaultValue: "pending",
    allowNull: false,
  },
  task_due_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Task };
