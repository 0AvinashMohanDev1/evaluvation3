const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const UserModel=mongoose.model("sprint_4_evaluvation",userSchema);

module.exports={
    UserModel
}