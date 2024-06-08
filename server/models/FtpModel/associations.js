const { Folder } = require("./FolderModel");
const { File } = require("./FileModel");
const { User } = require("../userModel");
const { FolderUser } = require("./FolderUserModel");

Folder.hasMany(File, { foreignKey: "folder_id" });
File.belongsTo(Folder, { foreignKey: "folder_id" });
Folder.belongsToMany(User, { through: FolderUser, foreignKey: "folder_id" });
User.belongsToMany(Folder, { through: FolderUser, foreignKey: "userId" });

module.exports = {
  Folder,
  File,
  User,
  FolderUser,
};

