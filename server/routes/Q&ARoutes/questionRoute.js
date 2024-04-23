const {askQuestionC, 
    getAllQuestionsC, 
    updateQuestionC, 
    deleteQC,
    getSingleQ,
    getSingleQuestionC}=require("../../controllers/Q&AControllers/questionController")
    const router=require('express').Router()
    router.post('/questions',askQuestionC)
    router.get('/questions',getAllQuestionsC)
    router.put('/questions/:id',updateQuestionC)
    router.delete('/questions/:id',deleteQC)
    router.get('/questions/:id',getSingleQuestionC)

    module.exports=router