const path = require("path");
const fs = require("fs");
const { createFolder, getFolders,} = require("../../models/FtpModel/FolderModel");
const{uploadFolder}=require('../../models/FtpModel/associations')
const Folder = require("../../models/FtpModel/FolderModel");
const File = require("../../models/FtpModel/FileModel");

const uploadFolderC = async (req, res, next) => {
  try {
    // console.log(req.body, 'Body:');
    console.log(req.files, 'Files: from controller');
    
    const parentFolder = req.body.parentFolder ? JSON.parse(req.body.parentFolder) : null;
    const folder_url = req.body.folder_url;
    const folder_name = req.body.folder_name;
    const files = req.files;

    // Check if folder_url or folder_name is undefined
    if (!folder_url || !folder_name) {
      return res.status(400).send("Folder URL and name are required.");
    }

    // Call uploadFolder function with correct arguments
    const uploadedFolder = await uploadFolder(parentFolder, folder_url, folder_name, files);

    res.status(201).json({
      message: "Folder uploaded successfully.",
      folder: uploadedFolder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading folder.");
  }
};

const createFolderC = async (req, res) => {
  try {
    const { parent_folder_id, folder_url, folder_name } = req.body;

    const parentFolder = parent_folder_id ? await Folder.findByPk(parent_folder_id) : null;

    if (parent_folder_id && !parentFolder) {
      return res.status(404).send("Parent folder not found.");
    }

    const newFolder = await createFolder(folder_name, parentFolder, folder_url);
    res.status(201).json(newFolder);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating folder.");
  }
};

const uploadFile = async (req, res) => {
  try {
    const folder = await Folder.findByPk(req.body.folder_id);

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    const filePath = path.join(folder.folder_url, req.file.originalname);
    fs.renameSync(req.file.path, filePath);

    const newFile = await File.create({
      name: req.file.originalname,
      folder_id: folder.folder_id,
    });

    res.status(201).send("File uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};

module.exports = { uploadFolderC, uploadFile, createFolderC };
