const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");
const path = require("path");

const Folder = sequelize.define("Folder", {
  folder_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  folder_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  folder_parent_id: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  folder_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define self-referencing association
Folder.hasMany(Folder, { as: "subfolders", foreignKey: "folder_parent_id" });
Folder.belongsTo(Folder, {
  as: "parentFolder",
  foreignKey: "folder_parent_id",
});

const createFolder = async (folder_name, parentFolder, folder_url) => {
  try {
    let folderPath;
    if (parentFolder) {
      folderPath = path.join(parentFolder,folder_url, folder_name);
    } else {
      folderPath = folder_url ? path.join(folder_url, folder_name) : null;
    }

    const newFolder = await Folder.create({
      folder_name,
      folder_parent_id: parentFolder ? parentFolder.folder_id : null,
      folder_url: folderPath,
    });
    return newFolder;
  } catch (error) {
    throw new Error("Error creating folder: " + error.message);
  }
};

const uploadFolder = async (parentFolder, folder_url, folder_name, files) => {
  try {
    const folderPath = parentFolder
      ? path.join(parentFolder.folder_url, folder_url, folder_name)
      : path.join(folder_url, folder_name);
    
    // Create folder entry
    const newFolder = await Folder.create({
      folder_name,
      folder_parent_id: parentFolder ? parentFolder.id : null,
      folder_url: folderPath,
    });

    // Insert files into File table
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      
      // Move file to folder path
      fs.renameSync(file.path, filePath);

      // Create file entry
      await File.create({
        name: file.name,
        folderId: newFolder.id,
      });
    }
    
    return newFolder;
  } catch (error) {
    throw new Error("Error uploading folder: " + error.message);
  }
};
const getFolders = async () => {
  try {
    const folders = await Folder.findAll();
    return folders;
  } catch (error) {
    throw new Error("Error getting folders: " + error.message);
  }
};

module.exports = {
  Folder,
  createFolder,
  getFolders,
  uploadFolder,
};
