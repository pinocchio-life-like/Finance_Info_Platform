const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");
const { Folder } = require("./FolderModel");

const File = sequelize.define("Files", {
  file_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mime_type: {
    type: DataTypes.STRING,
  },
  folder_id: {
    type: DataTypes.UUID,
    references: {
      model: Folder,
      key: "folder_id",
    },
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {
  File,
};

