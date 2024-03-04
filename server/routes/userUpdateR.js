const router=require('express').Router()
const {updateUser}=require('../controllers/userUpadateC')
//update user route
router.put('/update/:id',updateUser)
module.exports=router