import React from "react";

const MessageList = ({ messages, user }) => {
  return (
    <div className="h-full w-full overflow-y-auto p-4 bg-gray-900 text-white scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.user.id === user.id;
        const isNewThread = index === 0 || messages[index - 1].user.id !== msg.user.id;

        return (
          <div
            key={msg.id}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${
              isNewThread ? "mt-6" : "mt-2"
            }`}
          >
            {!isCurrentUser && (
              <div className="flex-shrink-0 mr-2 w-8">
                {isNewThread ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {msg.user.username
                      .split(" ")
                      .map((name) => name[0].toUpperCase())
                      .join("")}
                  </div>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            )}

            <div className="flex flex-col max-w-xs sm:max-w-sm md:max-w-md">
              {!isCurrentUser && isNewThread && (
                <div className="text-xs text-blue-400 mb-1 font-medium">{msg.user.username}</div>
              )}

              <div className={`flex items-end ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`rounded-lg px-3 py-2 break-words ${
                    isCurrentUser ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {msg.content}
                </div>

                <div
                  className={`text-xs text-gray-500 ${
                    isCurrentUser ? "mr-2" : "ml-2"
                  } whitespace-nowrap`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            </div>

            {isCurrentUser && (
              <div className="flex-shrink-0 w-8">
                <div className="w-8 h-8"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
