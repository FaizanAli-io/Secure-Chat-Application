const MessageList = ({ messages }) => {
  return (
    <div className="h-96 overflow-y-auto border-b p-2">
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2">
          <span className="font-semibold">{msg.user.username}: </span>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
