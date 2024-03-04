const router=require('express').Router()
const {userloginC,refreshTokenC}=require('../controllers/userloginC')
//login route
router.post('/login',userloginC)
//refresh token
router.post('/refreshToken',refreshTokenC)

module.exports=router
