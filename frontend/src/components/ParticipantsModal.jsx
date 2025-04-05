import React from "react";

const ParticipantsModal = ({ participants, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Participants</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        <ul className="text-white">
          {participants.map((participant) => (
            <li key={participant.id} className="py-2 border-b border-gray-700">
              {participant.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParticipantsModal;
