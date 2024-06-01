const { Folder } = require("./FolderModel");
const { File } = require("./FileModel");
const { User } = require("../userModel");
const path = require("path");
const fs = require("fs");

Folder.hasMany(File, { foreignKey: "folder_id" });
File.belongsTo(Folder, { foreignKey: "folder_id" });
Folder.belongsToMany(User, { through: "FolderUser" });
User.belongsToMany(Folder, { through: "FolderUser" });

// const uploadFolder = async (parentFolder, folder_url, folder_name, files) => {
//   console.log(files, "files from association");

//   if (!Array.isArray(files)) {
//     throw new Error("Files must be an array");
//   }

//   let newfiles = [];

//   try {
//     const folderPath = parentFolder
//       ? path.join(parentFolder.folder_url, folder_url, folder_name)
//       : path.join(folder_url, folder_name);

//     const newFolder = await Folder.create({
//       folder_name,
//       folder_parent_id: parentFolder ? parentFolder.folder_id : null,
//       folder_url: folderPath,
//     });

//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath, { recursive: true });
//     }

//     for (const file of files) {
//       const filePath = path.join(folderPath, file.originalname);
//       fs.renameSync(file.path, filePath);

//       const newfile = await File.create({
//         name: file.originalname,
//         folder_id: newFolder.folder_id,
//         file_url: filePath,
//         mime_type: file.mimetype,
//       });

//       newfiles.push(newfile);
//     }

//     return { newFolder, newfiles };
//   } catch (error) {
//     throw new Error("Error uploading folder: " + error.message);
//   }
// };
const uploadFolder = async (parentFolder, folder_url, folder_name, files) => {
  console.log(files, "files from association");

  if (!Array.isArray(files)) {
    throw new Error("Files must be an array");
  }

  let newfiles = [];

  try {
    const folderPath = parentFolder
      ? path.join(parentFolder.folder_url, folder_url, folder_name)
      : path.join(folder_url, folder_name);

    const newFolder = await Folder.create({
      folder_name,
      folder_parent_id: parentFolder ? parentFolder.folder_id : null,
      folder_url: folderPath,
    });

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    for (const file of files) {
      const filePath = path.join(folderPath, file.originalname);
      fs.writeFileSync(filePath, file.buffer);

      const newfile = await File.create({
        name: file.originalname,
        folder_id: newFolder.folder_id,
        file_url: filePath,
        mime_type: file.type,
      });

      newfiles.push(newfile);
    }

    return { newFolder, newfiles };
  } catch (error) {
    throw new Error("Error uploading folder: " + error.message);
  }
};


module.exports = { uploadFolder };





