import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditRoomDialog from "./EditRoomDialog";
import CreateRoomDialog from "./CreateRoomDialog";
import axios from "axios";

const Sidebar = ({ rooms, onRoomSelect, refreshRooms, user }) => {
  const [editingRoom, setEditingRoom] = useState(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteRoom = async (roomId) => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/rooms/${roomId}`);
      refreshRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Rooms</h2>
      <ul className="flex-grow overflow-y-auto">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="flex justify-between items-center px-4 py-2 rounded hover:bg-gray-700 relative group"
          >
            <span onClick={() => onRoomSelect(room.id)} className="cursor-pointer flex-1">
              {room.name}
            </span>
            <div className="flex gap-2">
              <button
                className="hidden group-hover:block text-gray-400 hover:text-white"
                onClick={() => setEditingRoom(room)}
              >
                ✏️
              </button>
              <button
                className="hidden group-hover:block text-gray-400 hover:text-red-500"
                onClick={() => deleteRoom(room.id)}
                disabled={deleting}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        onClick={() => setCreatingRoom(true)}
      >
        + Create Room
      </button>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        onClick={handleLogout}
      >
        Logout
      </button>

      {editingRoom && (
        <EditRoomDialog
          user={user}
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          refreshRooms={refreshRooms}
        />
      )}

      {creatingRoom && (
        <CreateRoomDialog
          user={user}
          onClose={() => setCreatingRoom(false)}
          refreshRooms={refreshRooms}
        />
      )}
    </div>
  );
};

export default Sidebar;
