const router = require('express').Router();
const {upload,ensureBody} = require('../../util/multer');
const { uploadFolderC, uploadFile, createFolderC } = require('../../controllers/ftpControllers/folderC');
// console.log(upload.array())

router.post('/upload/folder',upload.array('files'), uploadFolderC);
router.post('/upload/file', upload.single('file'), uploadFile);

module.exports = router;
 
