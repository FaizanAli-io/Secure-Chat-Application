import { useState, useEffect } from "react";
import axios from "axios";

const EditRoomDialog = ({ room, user, onClose, refreshRooms }) => {
  const [users, setUsers] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: allUsers } = await axios.get("http://localhost:3000/users");
      const { data: roomData } = await axios.get(`http://localhost:3000/rooms/${room.id}/users`);

      setRoomUsers(roomData.filter((u) => u.id !== user.id));
      setUsers(allUsers.filter((u) => !roomData.some((ru) => ru.id === u.id) && u.id !== user.id));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoomUsers = async (userId, action) => {
    setUpdating(true);
    try {
      if (action === "add") {
        await axios.post(`http://localhost:3000/rooms/${room.id}/users/${userId}`);
      } else {
        await axios.delete(`http://localhost:3000/rooms/${room.id}/users/${userId}`);
      }
      await fetchUsers();
      refreshRooms();
    } catch (error) {
      console.error("Error updating room users:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-white">Edit Room: {room.name}</h3>
        {loading ? (
          <p className="text-center text-gray-400">Loading users...</p>
        ) : (
          <>
            <h4 className="font-semibold text-white">Remove Users</h4>
            <div className="max-h-40 overflow-y-auto border p-2 mb-2 border-gray-600">
              {roomUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 transition duration-200 rounded"
                >
                  <button
                    onClick={() => updateRoomUsers(u.id, "remove")}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                    disabled={updating}
                  >
                    ➖
                  </button>
                  <span>{u.username}</span>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-white">Add Users</h4>
            <div className="max-h-40 overflow-y-auto border p-2 mb-2 border-gray-600">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 transition duration-200 rounded"
                >
                  <button
                    onClick={() => updateRoomUsers(u.id, "add")}
                    className="text-green-500 hover:text-green-700 transition duration-200"
                    disabled={updating}
                  >
                    ➕
                  </button>
                  <span>{u.username}</span>
                </div>
              ))}
            </div>

            {updating && <p className="text-center text-blue-500">Updating...</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition duration-200"
                disabled={updating}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditRoomDialog;
