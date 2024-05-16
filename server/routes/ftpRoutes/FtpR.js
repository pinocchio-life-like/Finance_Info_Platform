const router=require('express').Router()
const upload=require('../../util/multer')
const{uploadFolderC, uploadFile}=require('../../controllers/ftpControllers/folderC')

router.post('/upload/folder', upload.array('files'), uploadFolderC);
router.post('/upload/file', upload.single('file'), uploadFile);

module.exports = router;