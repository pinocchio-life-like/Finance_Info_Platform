const router=require('express').Router()

const {updateUsers}=require('../controllers/userUpdateC')
//update user route
router.put('/update/:id',updateUsers)

module.exports=router