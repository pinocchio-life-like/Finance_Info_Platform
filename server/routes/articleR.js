const {articleC,getAllArticlesC,updateArticleC,deleteArticleC}=require('../controllers/articleC')
const router=require('express').Router()

router.post('/article',articleC)
router.get('/articles',getAllArticlesC)
router.put('/article/:id',updateArticleC)
router.delete('/article/:id',deleteArticleC)

module.exports=router