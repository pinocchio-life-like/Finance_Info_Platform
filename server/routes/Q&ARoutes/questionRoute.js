const {askQuestionC, 
    getAllQuestionsC, 
    updateQuestionC, 
    deleteQC}=require("../../controllers/Q&AControllers/questionController")
    const router=require('express').Router()
    router.post('/questions',askQuestionC)
    router.get('/questions',getAllQuestionsC)
    router.put('/questions/:id',updateQuestionC)
    router.delete('/questions/:id',deleteQC)

    module.exports=router