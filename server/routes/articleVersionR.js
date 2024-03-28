
const router=require('express').Router()
const{versionController, getVersionById: getVersionByIdController}=require('../controllers/articleVersionC')

router.get('/versions/:id',versionController)
router.get('/articleversion/:versionId', getVersionByIdController);
module.exports=router
