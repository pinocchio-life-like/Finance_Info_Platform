const {getAllUsers}=require('../models/models')
const getUserC=async(req,res)=>{
    const users=await getAllUsers()
    if(!users){
        res.status(401).json({message:"No users found"})
    }
    else{
        res.status(200).json({message:"All users",data:users})
    }

}

module.exports={getUserC}