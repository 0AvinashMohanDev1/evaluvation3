const express=require("express");
const {connection}=require("./config/db");
const {client}=require("./config/redis");
const {UserRoute}=require("./router/user.route");
const app=express();
app.use(express.json());
app.use("",UserRoute);

app.listen(4300,async()=>{
    try{
        await connection;
        await client;
        console.log("connected at 4300");
    }catch(err){
        console.log({"error":err.message});
    }
})