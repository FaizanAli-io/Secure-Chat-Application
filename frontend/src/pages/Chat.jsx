import axios from "axios";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ParticipantsModal from "../components/ParticipantsModal";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomParticipants, setRoomParticipants] = useState([]);

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

      const participantsData = await axios.get(`http://localhost:3000/rooms/${roomId}/users`);
      setRoomParticipants(participantsData.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar rooms={rooms} onRoomSelect={fetchMessages} refreshRooms={fetchRooms} user={user} />
      <main className="flex flex-col flex-1 bg-gray-800 shadow-lg rounded-2xl mx-6 my-4 overflow-hidden">
        {selectedRoom ? (
          <>
            <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
              <h2 className="text-lg font-semibold">{selectedRoomName}</h2>
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full text-sm"
                onClick={toggleModal}
              >
                View Participants
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <MessageList messages={messages} user={user} />
            </div>
            <div className="border-t border-gray-700 p-4 bg-gray-700">
              <MessageInput roomId={selectedRoom} onMessageSent={fetchMessages} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </main>

      {isModalOpen && <ParticipantsModal participants={roomParticipants} onClose={toggleModal} />}
    </div>
  );
};

export default Chat;
