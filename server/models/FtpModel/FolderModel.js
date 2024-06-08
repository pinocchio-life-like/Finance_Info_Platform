const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");
const { FolderUser } = require("./FolderUserModel");
const { User } = require("../userModel");

const Folder = sequelize.define("Folders", {
  folder_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  folder_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  folder_parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  folder_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define self-referencing association
Folder.hasMany(Folder, {
  as: "subfolders",
  foreignKey: "folder_parent_id",
  sourceKey: "folder_id",
  onDelete: "CASCADE",
});
Folder.belongsTo(Folder, {
  as: "parentFolder",
  foreignKey: "folder_parent_id",
  targetKey: "folder_id",
  onDelete: "CASCADE",
});

// In your Folder model
Folder.belongsToMany(User, { through: FolderUser, foreignKey: "folder_id" });

module.exports = {
  Folder,
};
