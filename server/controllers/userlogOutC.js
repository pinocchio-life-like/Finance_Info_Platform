const logoutC=(req,res)=>{
    try {
        const refreshToken=req.body.refreshToken
    if(!refreshToken){
        res.status(401).json({
            message:"No refresh token provided"
        })
        rturn ;
    }
    else{
        //clear the token
        res.clearCookie('token')
        
        res.status(200).json({
            message:"Logout successful"
        })
    }
        
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message:"Internal Server Error",
        })
        
    }
}

module.exports={
    logoutC
}