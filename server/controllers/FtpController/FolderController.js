const { Folder } = require("../../models/FtpModel/FolderModel");
const { File } = require("../../models/FtpModel/FileModel");
const { FolderUser } = require("../../models/FtpModel/associations");
const { User } = require("../../models/userModel");
const { Sequelize } = require("sequelize");
const pathModule = require("path");
const fs = require("fs");
const multer = require("multer");
const mime = require("mime-types");
const sequelize = require("../../config/db.config");
const archiver = require('archiver');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const index = parseInt(
      file.fieldname.replace("files[", "").replace("]", "")
    );
    console.log("index", req.body.folder_url);
    const dir = pathModule.join(
      "./_root_",
      req.body.folder_url || "",
      pathModule.dirname(req.body.paths[index])
    );
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const index = parseInt(
      file.fieldname.replace("files[", "").replace("]", "")
    );
    cb(null, pathModule.basename(req.body.paths[index]));
  },
});

const upload = multer({ storage: storage }).any();

const getAllFoldersController = async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.json({ message: "These are the existing folders", data: folders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting folders: " + error.message });
  }
};

const createFolderController = async (req, res) => {
  const { folder_name, folder_parent_id, folder_url, user_name } = req.body;
  try {
    const parentFolder = folder_parent_id === "null" ? null : folder_parent_id;

    const user = await User.findOne({ where: { userName: user_name } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newFolder = await Folder.create({
      folder_name,
      folder_parent_id: parentFolder,
      folder_url: folder_url,
    });

    // Assign the creator as admin
    await FolderUser.create({
      userId: user.userId,
      folder_id: newFolder.folder_id,
      permission: "admin",
    });

    res.json({ message: "Folder created successfully", data: newFolder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating folder: " + error.message });
  }
};

const uploadFolderController = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json(err);
    } else if (err) {
      console.error("Other error:", err);
      return res.status(500).json(err);
    }

    try {
      const { folder_url, paths, userName, folder_parent_id } = req.body;
      // Get user
      const user = await User.findOne({ where: { userName } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Parse paths to get unique folders
      const folders = new Set();
      const files = [];
      for (const path of paths) {
        const parts = path.split("/");
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          // Exclude the file part
          currentPath = pathModule.join(currentPath, parts[i]);
          folders.add(currentPath);
        }
        files.push({ path: currentPath, name: parts[parts.length - 1] });
      }

      // Create folder entries
      const folderIds = {};
      for (const folderPath of folders) {
        const folder_name = pathModule.basename(folderPath);
        const parentFolderPath = pathModule.dirname(folderPath);

        let parentFolder = null;
        if (folderIds.hasOwnProperty(parentFolderPath)) {
          parentFolder = folderIds[parentFolderPath];
        } else if (folder_parent_id !== "null") {
          parentFolder = folder_parent_id;
        }

        // Check if the folder already exists
        let folder = await Folder.findOne({
          where: { folder_name, folder_parent_id: parentFolder },
        });

        if (!folder) {
          // Check if a file with the same name already exists in the same folder
          const existingFile = await File.findOne({
            where: { file_name: folder_name, folder_id: parentFolder },
          });

          if (existingFile) {
            return res.status(400).json({
              message:
                "A file with the same name already exists in this folder",
            });
          }

          folder = await Folder.create({
            folder_name,
            folder_parent_id: parentFolder,
            folder_url: `${folder_url}/${folderPath}`.replace(/\\/g, "/"),
          });

          // Create a FolderUser entry with 'admin' permission
          await FolderUser.create({
            userId: user.userId,
            folder_id: folder.folder_id,
            permission: "admin",
          });
        }

        folderIds[folderPath] = folder.folder_id;
      }

      // Create file entries
      for (const file of files) {
        const file_name = file.name;
        const folder_id = folderIds[file.path];

        // Check if the file already exists
        let existingFile = await File.findOne({
          where: { file_name, folder_id },
        });

        if (!existingFile) {
          existingFile = await File.create({
            file_name,
            folder_id,
            file_url:
              `http://localhost:5000/_root_/${folder_url}/${file.path}/${file_name}`.replace(
                /\\/g,
                "/"
              ),
            mime_type: mime.lookup(file_name) || "application/octet-stream", // Default to 'application/octet-stream' if the MIME type can't be determined
            user_name: userName,
          });
        }
      }

      res.json({ message: "Folders and files created successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error creating folders and files: " + error.message,
      });
    }
  });
};

const assignUserToFolder = async (req, res) => {
  const { users, folder_id } = req.body;

  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Get all existing FolderUsers for the folder
    const existingFolderUsers = await FolderUser.findAll({
      where: { folder_id },
      transaction,
    });

    // Loop over the users array
    for (const user of users) {
      // Find an existing FolderUser for the user and folder
      const existingFolderUser = existingFolderUsers.find(
        (folderUser) => folderUser.userId === user.userId
      );

      if (existingFolderUser) {
        // If the FolderUser exists and the permission is different, update it
        if (existingFolderUser.permission !== user.permission) {
          await existingFolderUser.update(
            { permission: user.permission },
            { transaction }
          );
        }
      } else {
        // If the FolderUser doesn't exist, create it
        await FolderUser.create(
          {
            userId: user.userId,
            folder_id,
            permission: user.permission,
          },
          { transaction }
        );
      }
    }

    // Delete any FolderUsers that weren't in the users array
    for (const existingFolderUser of existingFolderUsers) {
      if (!users.some((user) => user.userId === existingFolderUser.userId)) {
        await existingFolderUser.destroy({ transaction });
      }
    }

    // Commit the transaction
    await transaction.commit();

    res.json({
      message: "Users assigned to folder successfully",
    });
  } catch (error) {
    // Rollback the transaction if any errors occurred
    if (transaction) await transaction.rollback();

    console.log(error); // Log the error

    res
      .status(500)
      .json({ message: "Error assigning users to folder: " + error.message });
  }
};

const getHomeFoldersController = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Folder,
          through: { attributes: [] }, // Exclude FolderUser from the result
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "These are the folders the user can access",
      data: user.Folders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user's folders: " + error.message });
  }
};

const getFolder_urlController = async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await Folder.findOne(id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder found", data: folder.folder_url });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting folder's URL: " + error.message });
  }
};

const getUserFoldersController = async (req, res) => {
  const { userName, folder_parent_id } = req.query;

  try {
    const user = await User.findOne({ where: { userName: userName } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parentFolder =
      folder_parent_id === undefined || folder_parent_id === "null"
        ? null
        : folder_parent_id;

    // Check if user has relation with parentFolder only if parentFolder is not null
    if (parentFolder !== null) {
      const userFolderRelation = await FolderUser.findOne({
        where: { userId: user.userId, folder_id: parentFolder },
      });

      if (!userFolderRelation) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // Get folder_ids from FolderUser table
    const folderUsers = await FolderUser.findAll({
      where: { userId: user.userId },
      attributes: ["folder_id"],
    });

    const folderIds = folderUsers.map((folderUser) => folderUser.folder_id);

    // Get folders
    const folders = await Folder.findAll({
      where: {
        folder_parent_id: parentFolder,
        folder_id: folderIds,
      },
      include: [
        {
          model: User,
          through: { attributes: ["permission"] }, // This will exclude the join table (FolderUser) from the data
          attributes: ["userName", "userId", "firstName"],
        },
      ],
    });

    // Flatten user structure
    folders.forEach((folder) => {
      folder.dataValues.Users = folder.Users.map((user) => {
        // Add permission to user object and remove FolderUsers object
        user.dataValues.permission = user.FolderUsers.permission;
        delete user.dataValues.FolderUsers;
        return user;
      });
    });

    for (let folder of folders) {
      const folderUser = await FolderUser.findOne({
        where: { folder_id: folder.folder_id, permission: "admin" },
      });

      if (folderUser) {
        const user = await User.findOne({
          where: { userId: folderUser.userId },
        });
        folder.dataValues.owner = user.userName;
        folder.dataValues.type = "folder";
      }
    }

    const files = await File.findAll({
      where: { folder_id: parentFolder },
      attributes: {
        include: [[Sequelize.literal('"file"'), "type"]],
      },
    });

    res.json({
      message: "These are the folders in the directory",
      data: { folders, files },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error getting folders and or files: " + error.message,
    });
  }
};

const deleteFolderC = async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await Folder.findByPk(id);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    const deletedFolder = await folder.destroy();
    if (deletedFolder) {
      return res.status(200).json({ message: "Folder deleted successfully" });
    } else {
      return res.status(500).json({ message: "Error deleting folder: Folder could not be deleted" });
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res.status(500).json({ message: "Error deleting folder: " + error.message });
  }
};


const updateFolderC = async (req, res) => {
  const { id } = req.params;
  const { folder_name } = req.body;
  // console.log("Received request to update folder with ID:", id);
  console.log("New folder name:", folder_name);

  try {
    const folder = await Folder.findByPk(id);
    if (!folder) {
      console.log("Folder not found with ID:", id);
      return res.status(404).json({ message: "Folder not found" });
    }

    // console.log("Found folder:", folder.toJSON());

    folder.folder_name = folder_name;
    const updatedFolder = await folder.save();


    console.log("Folder updated successfully:", updatedFolder.toJSON());

    return res.status(200).json({ message: "Folder updated successfully", data: updatedFolder });
  } catch (error) {
    console.error("Error updating folder:", error);
    return res.status(500).json({ message: "Error updating folder: " + error.message });
  }
};

// const zipAndDownloadFolder = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const folder = await Folder.findByPk(id);
//     // console.log(folder,'from folder')
//     if (!folder) {
//       return res.status(404).json({ message: 'Folder not found' });
//     }

//     // Get folder contents (assuming they are stored in a database)
//     const folderContents = await File.findAll({ where: { folder_id: id } });

//     // Create a zip file
//     const zipFileName = `folder_${folder.id}.zip`;
//     const output = fs.createWriteStream(zipFileName);
//     const archive = archiver('zip', { zlib: { level: 9 } });

//     output.on('close', () => {
//       console.log(`Zip file ${zipFileName} created successfully`);
//       res.download(zipFileName); // Send the zip file for download
//     });

//     archive.pipe(output);
//     // Add folder contents to the zip file
//     folderContents.forEach((file) => {
//       // console.log(file)
//       // const path=file.file_url
//       // const fileUrl =path.replace('http://localhost:5000/_root_','')
     
//       archive.append(fs.createReadStream(file.file_url), { name: file.file_name });
//     });
//     archive.finalize();
//   } catch (error) {
//     console.error('Error zipping and downloading folder:', error);
//     return res.status(500).json({ message: 'Error zipping and downloading folder', error: error.message });
//   }
// };



module.exports = {
  getAllFoldersController,
  createFolderController,
  uploadFolderController,
  assignUserToFolder,
  getUserFoldersController,
  getFolder_urlController,
  getHomeFoldersController,
  deleteFolderC,
  updateFolderC,
  // zipAndDownloadFolder
};
