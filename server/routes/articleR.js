const {articleC,getAllArticlesC,updateArticleC,deleteArticleC,getAllVersionsC}=require('../controllers/articleC')
const router=require('express').Router()

router.post('/article',articleC)
router.get('/articles',getAllArticlesC)
router.put('/article/:id',updateArticleC)
router.delete('/article/:id',deleteArticleC)
router.get('/versions',getAllVersionsC)


module.exports=router