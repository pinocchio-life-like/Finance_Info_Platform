const{taskPost,taskGetByUserIdC,taskGetAll,taskUpdate}=require('../../controllers/noticeControler/taskC')
const router=require('express').Router()

router.post('/task',taskPost)
router.get('/task/:id',taskGetByUserIdC)
router.get('/task',taskGetAll)
router.put('/task/:id',taskUpdate)