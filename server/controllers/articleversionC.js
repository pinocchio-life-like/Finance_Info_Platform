const{getallversionsOFAnArticle} =require('../models/articleVersionModel')
const versionController=async(req,res)=>{
    const {id}=req.params
const versions=await getallversionsOFAnArticle(id)
try {
    if(!versions){
        res.json({message:"No versions found"})
    }
    else{
        res.json({
            message:"This are the existing versions",
        data:versions})
    }
} catch(error) {
    res.status(500).json({message:"Internal server error fron version from version controller"})
    
}
}

module.exports={versionController}