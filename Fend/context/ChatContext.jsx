import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { ChatContext } from "./chat-context.js";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {

const [messages, setMessages] = useState([]);
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [unseenMessages, setUnseenMessages] = useState({});

const { socket, axios } = useContext(AuthContext);

// let it work 

const getUsers = async () => {
    try {
        const { data } = await axios.get("/api/messages/users");
        if (data.success) {
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
        }
    } catch (error) {
        toast.error(error.message);
    }
}



const getMessages = async (userId) => {
    try {
        const { data } = await axios.get(`/api/messages/${userId}`);
        if (data.success) {
            setMessages(data.messages);
        }
    } catch (error) {
        toast.error(error.message);
    }
}



const sendMessage = async (messageData) => {
    try {
        const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
        if (data.success) {
            setMessages(prev => [...prev, data.newMessage]);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
}



const subscribeToMessages = () => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
            setMessages(prev => {
                if (prev.some(m => m._id === newMessage._id)) return prev;
                return [...prev, newMessage];
            });

            axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
            setUnseenMessages(prev => ({
                ...prev,
                [newMessage.senderId]: prev[newMessage.senderId]
                    ? prev[newMessage.senderId] + 1
                    : 1
            }));
        }
    });
}



const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
}



useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
}, [socket, selectedUser]);





const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages
};

return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
)

}

