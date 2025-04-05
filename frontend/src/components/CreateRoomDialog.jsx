import axios from "axios";
import { useState, useEffect } from "react";

const CreateRoomDialog = ({ user, refreshRooms, onClose }) => {
  const [users, setUsers] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/users");
      setUsers(data.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await axios.post("http://localhost:3000/rooms", {
        name: newRoomName,
        userIds: [user.id, ...selectedUsers]
      });
      setNewRoomName("");
      setSelectedUsers([]);
      onClose();
      refreshRooms();
    } catch (error) {
      setError("Error creating room: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-white">Create Room</h3>
        {loading ? (
          <p className="text-center text-gray-400">Loading users...</p>
        ) : (
          <form onSubmit={createRoom}>
            <input
              type="text"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-2"
              required
            />
            <div className="max-h-40 overflow-y-auto border p-2 mb-2 border-gray-600">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={() => toggleUserSelection(u.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-white">{u.username}</span>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateRoomDialog;
