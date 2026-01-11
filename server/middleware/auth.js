 // middleware is a function executed before the execution of the controller function 
 // we are making it so that if the user is authenticated then only it can access the particular api endpoint 
 import jwt from "jsonwebtoken";
 import User from "../models/User.js";
 
 export const protectRoute =async( req, res, next)=>{
    try {
        const token =req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success:false , message: "User not found"});

        req.user = user;
        next();


    } catch (error) {
        console.log(error.message)
        return res.json({success:false , message: error.message});
        
    }
 }


