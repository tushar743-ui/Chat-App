// get all users except the logges in user 
// store messages in db and display on web page 

import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io , userSocketMap } from "../server.js";



export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user_Id;
        const filterUsers = await User.find({ _id: { $ne: userId } }).select(
            "-password"
        );


        //count number of messages not seen 
        const unseenMessages = {}
        const promises = filterUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filterUsers, unseenMessages });
    } catch (error) {
        console.log((error.message));
        res.json({ success: false, message: error.message })
    }
}




//get all messages for the selected user 
export const getMessages = async (req, res) => {
    try {
        const { id: SelectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: SelectedUserId },
                { senderId: SelectedUserId, receiverId: myId },
            ]
        })
        await Message.updateMany(
            { senderId: SelectedUserId, receiverId: myId },
          { $set:  { seen: true }}
        );

        res.json({ success: true, messages })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, messages: error.message })
    }
}





//api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}


// this fuction will send message then - 
// send message to selected user 
export const sendMessage = async(req, res)=>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat_images"
            });

            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl,

        })


        //  reveiver wil instantly receive the message using socket.io
        // edit the new message to the receiver's socket 
        const receiverSocketId  = userSocketMap[receiverId];
        if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }



        res.json({success:true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
        
    }
}