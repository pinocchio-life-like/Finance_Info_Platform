const sequelize = require("../../config/db.config");
const { DataTypes } = require("sequelize");
const { Folder } = require("./FolderModel");
const { User } = require("../userModel");

const FolderUser = sequelize.define(
  "FolderUsers",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userId",
      },
    },
    folder_id: {
      type: DataTypes.UUID,
      references: {
        model: Folder,
        key: "folder_id",
      },
    },
    permission: {
      type: DataTypes.ENUM,
      values: ["read", "write", "admin"],
      defaultValue: "read",
    },
  },
  {
    primaryKey: ["userId", "folder_id"],
  }
);

module.exports = { FolderUser };
