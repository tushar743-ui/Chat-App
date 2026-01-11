import express from "express"
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messagesRouter from "./routes/messageRoute.js";
import { Server} from "socket.io"



// create express app and http  server
const app= express();
const server = http.createServer(app)


//  initialyse socket.io server 
export const io= new Server(server, {
    cors:{ origin: "*"}
})


// socket.io lets your app send & receive data instantly between user and without reloding the page 
// store online users 
export const userSocketMap= {};  // {userId: socketId}


//Socket.io connection handler 
io.on("connection", (socket)=>{
    const userId= socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId]= socket.id;
    
    
    // emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", ()=>{
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
})

})






//middleware setup
app.use(cors({
  origin: [
    "https://chat-app-eight-liard.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json({limit:"4mb"}))


//Router setup
app.use("/api/status", (req,res)=> res.send("Server is live "));
app.use("/api/auth", userRouter)
app.use("/api/messages" , messagesRouter)

// connect to mongodb
await connectDB();


if(process.env.NODE_ENV!=="production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT , ()=> console.log("Server is running on PORT: " + PORT ));

}
// export server for vercel
export default server;