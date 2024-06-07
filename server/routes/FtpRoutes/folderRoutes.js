const {
  createFolderController,
  uploadFolderController,
  getUserFoldersController,
  getFolder_urlController,
  assignUserToFolder,
  deleteFolderC,
  updateFolderC
} = require("../../controllers/FtpController/FolderController");

const router = require("express").Router();

// Folder routes
router.get("/folders/userFolder", getUserFoldersController);
router.get("/folder/folder_url/:id", getFolder_urlController);
router.post("/folder/create", createFolderController);
router.post("/folders/upload", uploadFolderController);
router.post("/assignUser/assign", assignUserToFolder);
router.delete('/folder/delete/:id', deleteFolderC);
router.put('/folder/update/:id', updateFolderC);

module.exports = router;
