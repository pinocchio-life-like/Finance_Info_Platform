const router=require("express").Router()
const{answerC, getAnswer}=require("../../controllers/Q&AControllers/answerController")
router.post("/answers",answerC)
router.get("/answers/:id",getAnswer)
module.exports=router