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
    values: ["Pending", "Completed", "Overdue"],
    defaultValue: "Pending",
    allowNull: false,
  },

  task_due_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Task };
