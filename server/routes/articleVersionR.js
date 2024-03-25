const router=require('express').Router()
const{versionController, getVersionById: getVersionByIdController}=require('../controllers/articleversionC')

router.get('/versions/:id',versionController)
router.get('/articleversion/:versionId', getVersionByIdController);
module.exports=router