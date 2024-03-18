const router=require('express').Router()
const{getUserC}=require('../controllers/getUsersC')

router.get('/users',getUserC)

module.exports=router