const {
  createFileController,
  getFilesController,
  readFileController,
  downloadFileController,
  deleteFileController,
  renameFileController,
} = require("../../controllers/FtpController/FileController");

const router = require("express").Router();

// File routes
router.post("/files/upload", createFileController);
router.get("/files", getFilesController);
router.get("/files/:fileId", readFileController);
router.get("/files/download/:fileId", downloadFileController);
router.delete("/files/:fileId", deleteFileController);
router.put("/files/rename/:id", renameFileController);

module.exports = router;
