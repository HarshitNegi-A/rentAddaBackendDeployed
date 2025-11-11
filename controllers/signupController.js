const User=require('../model/UserModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

require('dotenv').config()

exports.signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const existingUser=await User.findOne({where:{email}})
        if(existingUser){
            return res.status(409).json({message:'User already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        console.log(user)
        const token=jwt.sign({id:user.id,name:user.name,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(201).json({message:"User successfully signed up",token,userName:user.name,userId:user.id })
    }
    catch(err){
        console.error(err)
        res.status(500).json({message:'Unable to signup'})
    }
}

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({where:{email}})
        if(!user){
            return res.status(404).json({message:"User does not exists"})
        }
        const validPass=await bcrypt.compare(password,user.password)
        if(!validPass){
            return res.status(401).json({message:"Invalid email or password"})
        }
         const token=jwt.sign({id:user.id,name:user.name,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'})
         res.status(200).json({message:"User logged in successfully",token,userName:user.name,userId:user.id })
    }
    catch(err){
        console.error(err)
        res.status(500).json({message:"Unable to login"})
    }
}