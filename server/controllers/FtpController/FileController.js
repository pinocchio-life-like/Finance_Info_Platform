const { File } = require("../../models/FtpModel/FileModel");
const pathModule = require("path");
const fs = require("fs");
const multer = require("multer");
const mime = require("mime-types");
const { Folder } = require("../../models/FtpModel/FolderModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = pathModule.join("./_root_", req.body.folder_url);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filename = Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).any();

const createFileController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    try {
      const folder = await Folder.findOne({
        where: { folder_id: req.body.folder_id },
      });

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      const createdFiles = [];

      for (const file of req.files) {
        const existingFile = await File.findOne({
          where: {
            file_name: file.filename,
            folder_id: req.body.folder_id,
          },
        });

        if (existingFile) {
          return res.status(400).json({ message: "File already exists" });
        }

        const newFile = await File.create({
          file_name: file.filename,
          file_url:
            `http://63.35.242.213:5000/_root_/${req.body.folder_url}/${file.filename}`.replace(
              /\\/g,
              "/"
            ),
          mime_type: mime.lookup(file.filename) || "application/octet-stream",
          folder_id: req.body.folder_id,
          user_name: req.body.userName,
        });

        createdFiles.push(newFile);
      }

      res.json({ message: "Files created successfully", data: createdFiles });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating files: " + error.message });
    }
  });
};

const getFilesController = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json({ message: "These are the existing files", data: files });
  } catch (error) {
    res.status(500).json({ message: "Error getting files: " + error.message });
  }
};

const readFileController = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const data = fs.readFileSync(file.file_url);
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: "Error reading file: " + error.message });
  }
};

const downloadFileController = async (req, res) => {
  const { fileId } = req.params;
  const destinationPath = pathModule.join(__dirname, "downloads", fileId);
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    fs.copyFileSync(file.file_url, destinationPath);
    res.download(destinationPath);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file: " + error.message });
  }
};

const deleteFileController = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    await file.destroy();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file: " + error.message });
  }
};

const renameFileController = async (req, res) => {
  const { newFileName } = req.body;
  const { id } = req.params;
  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const existingFile = await File.findOne({
      where: {
        file_name: newFileName,
        folder_id: file.folder_id,
      },
    });

    if (existingFile) {
      return res.status(400).json({ message: "File already exists" });
    }

    file.file_name = newFileName;
    await file.save();
    res.json({ message: "File renamed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error renaming file: " + error.message });
  }
};

module.exports = {
  createFileController,
  getFilesController,
  readFileController,
  downloadFileController,
  deleteFileController,
  renameFileController,
};
