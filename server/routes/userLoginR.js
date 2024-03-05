const router=require('express').Router()
const { logoutC } = require('../controllers/userlogOutC')
const {userloginC,refreshTokenC}=require('../controllers/userloginC')

//login route
router.post('/login',userloginC)
//refresh token
router.post('/refreshToken',refreshTokenC)
router.post('/logout',logoutC)

module.exports=router
