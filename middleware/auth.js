require("dotenv").config()
const jwt=require('jsonwebtoken')


const auth=(req,res,next)=>{
    try{

        const authHeaders=req.headers.authorization
        if(!authHeaders || !authHeaders.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized:Token required"})
        }
        const token=authHeaders.split(" ")[1]
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()

    }
    catch(err){
        console.error(err)
        return res.status(401).json({message:'Invalid or expired token'})
    }
}
module.exports=auth