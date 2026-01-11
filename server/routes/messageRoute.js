import express from "express"
import {protectRoute} from "../middleware/auth.js"
import { getMessages, getUserForSidebar , markMessageAsSeen, sendMessage } from "../controllers/messageController.js"


const messagesRouter = express.Router();



//api endpoints 
messagesRouter.get("/users", protectRoute , getUserForSidebar);
messagesRouter.get("/:id", protectRoute, getMessages);
messagesRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messagesRouter.post("/send/:id", protectRoute , sendMessage)

export default messagesRouter;











