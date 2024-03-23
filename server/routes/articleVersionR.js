const router=require('express').Router()
const{versionController}=require('../controllers/articleversionC')

router.get('/versions/:id',versionController)

module.exports=router