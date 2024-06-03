const { Folder } = require("../../models/FtpModel/FolderModel");
const { File } = require("../../models/FtpModel/FileModel");
const { FolderUser } = require("../../models/FtpModel/associations");
const { User } = require("../../models/userModel");
const { Op, Sequelize } = require("sequelize");
const pathModule = require("path");
const fs = require("fs");
const multer = require("multer");
const mime = require("mime-types");

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
  const { userId, folderId, permission } = req.body;
  try {
    const folderUser = await FolderUser.create({
      userId,
      folder_id: folderId,
      permission,
    });
    res.json({
      message: "User assigned to folder successfully",
      data: folderUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning user to folder: " + error.message });
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
    const folder = await Folder.findByPk(id);
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

    const folders = await Folder.findAll({
      where: { folder_parent_id: parentFolder },
      include: [
        {
          model: User,
          through: { where: { userId: user.userId } },
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "userRole"],
          },
        },
      ],
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

module.exports = {
  getAllFoldersController,
  createFolderController,
  uploadFolderController,
  assignUserToFolder,
  getUserFoldersController,
  getFolder_urlController,
  getHomeFoldersController,
};
