import axios from "axios";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState("");

  useEffect(() => {
    if (user) fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/rooms/user/${user.id}`);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchMessages = async (roomId) => {
    setSelectedRoom(roomId);
    const room = rooms.find((r) => r.id === roomId);
    setSelectedRoomName(room ? room.name : "Chat");
    try {
      const { data } = await axios.get(`http://localhost:3000/messages/room/${roomId}`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar rooms={rooms} onRoomSelect={fetchMessages} refreshRooms={fetchRooms} user={user} />
      <main className="flex flex-col flex-1 bg-white shadow-lg rounded-2xl mx-6 my-4 overflow-hidden">
        {selectedRoom ? (
          <>
            <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
              <h2 className="text-lg font-semibold"> {selectedRoomName} </h2>
            </div>
            <div className="flex flex-col flex-1 p-6 overflow-y-auto">
              <MessageList messages={messages} />
            </div>
            <div className="border-t p-4 bg-gray-50">
              <MessageInput roomId={selectedRoom} onMessageSent={fetchMessages} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
