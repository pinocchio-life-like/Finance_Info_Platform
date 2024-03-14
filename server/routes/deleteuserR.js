const router=require('express').Router()
const {deleteUserC}=require('../controllers/deleteUserC')
router.delete('/delete/:id',deleteUserC)
module.exports=router
