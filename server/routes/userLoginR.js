const router=require('express').Router()
const {userloginC}=require('../controllers/userloginC')
router.post('/login',userloginC)

module.exports=router
