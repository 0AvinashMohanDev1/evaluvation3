const express=require("express");
require("dotenv").config();
const {UserModel}=require("../models/user.model");
const UserRoute=express.Router();
const {client}=require("../config/redis");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {auth}=require("../middleware/authenticate");
const {logger}=require("../logger/logger");
UserRoute.get("/",(req,res)=>{
    res.send("all is well");
})


UserRoute.post("/signup",async(req,res)=>{
    try{
        let user=req.body;
        let temp=await UserModel.findOne({"email":user.email});
        if(temp) return res.send("user already registerd");
        bcrypt.hash(user.password,7,async(err,hash)=>{
            if(err) return res.send({"error":err.message});
            user.password=hash;
            user=new UserModel(user);
            await user.save();
            res.send("new user created");
        })
    }catch(err){
        res.send({"error":err.message});
    }
})

UserRoute.post("/login",async(req,res)=>{
    try{
        let temp=req.body;
        let user=await UserModel.findOne({"email":temp.email});
        if(!user)return res.send("please signup first");
        bcrypt.compare(temp.password,user.password,async(err,decoded)=>{
            if(err)return res.send({"error":err.message});
            let token=jwt.sign({userId:user._id},process.env.JWT_TOKEN,{expiresIn:60});
            let refreshToken=jwt.sign({userId:user._id},process.env.JWT_REFRESH_TOKEN,{expiresIn:240});
            await client.set("token",token);
            await client.set("refreshToken",refreshToken);
            res.send("logged in successfullly");
        })
    }catch(err){
        res.send({"error":err.message});
    }
})

UserRoute.get("/logout",async(req,res)=>{
    let token=await client.get("token");
    let refreshToken=await client.get("refreshToken");
    await client.rPush("blackListedTokens",token,refreshToken);
    res.send("logged out successfully");
})

logger.log({
    level:"info",
    message:"working"
})

UserRoute.get("/all",auth,async(req,res)=>{
    try{
        let user=await UserModel.find();
        res.send(user);
    }catch(err){
        res.send(err.message);
    }
})

// UserRoute.get()

module.exports={
    UserRoute
}