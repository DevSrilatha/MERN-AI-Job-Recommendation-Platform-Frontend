import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Chat = ({ currentUser, receiver }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    // Register current user on socket
    newSocket.emit("registerUser", currentUser);

    // Listen for messages
    newSocket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/chat/${receiver}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (receiver) {
      fetchMessages();
    }
  }, [receiver]);

  // Send a new message
  const sendMessage = async () => {
    if (!message.trim() || !socket) return;

    const newMessage = {
      senderId: currentUser,
      receiverId: receiver,
      message,
    };

    socket.emit("sendMessage", newMessage);

    try {
      await axios.post(`${BASE_URL}/api/chat/send`, newMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h4>Chat with {receiver}</h4>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} className={msg.senderId === currentUser ? "sent" : "received"}>
            {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
