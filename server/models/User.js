//this api file is created so that user can use features like login,logout,create account  user features etc 
//using mongodb models we can store the data in mogodb database 


import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email:{type: String , required :true , unique:true},
    fullName: {type:String, required:true},
    password: {type:String , required:true},
    profilePic: {type:String , default: ""},
    bio: {type: String},
}, {timestamps:true});


const User = mongoose.model("User" ,userSchema)
export default User;