const router=require('express').Router()
const {companyC,getAllCompaniesC} =require('../controllers/companyC')
const {MianC,getAllMainCompanyC}=require('../controllers/mainCompanyC')
// router.post('/main',MianC)
router.post('/company',companyC)
// router.get('/main',getAllMainCompanyC)
router.get('/company',getAllCompaniesC)
module.exports=router