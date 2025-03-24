import axios from "axios";
import { useState } from "react";

const MessageInput = ({ roomId, onMessageSent }) => {
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post("http://localhost:3000/messages", {
        content: newMessage,
        roomId,
        userId: user.id
      });
      setNewMessage("");
      onMessageSent(roomId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form onSubmit={sendMessage} className="mt-4 flex">
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 p-2 border rounded"
        required
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
