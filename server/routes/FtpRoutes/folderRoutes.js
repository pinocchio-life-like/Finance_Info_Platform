const {
  getAllFoldersController,
  createFolderController,
  uploadFolderController,
  getUserFoldersController,
  getFolder_urlController,
  // getHomeFoldersController,
} = require("../../controllers/FtpController/FolderController");

const router = require("express").Router();

// Folder routes
router.get("/folders/userFolder", getUserFoldersController);
// router.get("/folders", getAllFoldersController);
// router.get("/home/folders/:id", getHomeFoldersController);
router.get("/folder/folder_url/:id", getFolder_urlController);
router.post("/folder/create", createFolderController);
router.post("/folders/upload", uploadFolderController);

module.exports = router;
