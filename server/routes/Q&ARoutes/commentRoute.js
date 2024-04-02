const{commentC,getCommentC}=require("../../controllers/Q&AControllers/commentController")
const router=require("express").Router()
router.post("/comments",commentC)
router.get('/comments/:id',getCommentC)
module.exports=router