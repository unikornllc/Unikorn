import { useEffect, useState } from "react";

export default function MessagePanel({ user, onInput, className }) {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onInput(message); // Send the message to the parent
      setMessage(""); // Clear the input field
    }
  };

  const displaySender = (message, index, messages) => {
    return index === 0 || messages[index - 1]?.fromSelf !== message.fromSelf;
  };

  // Guard against no user selected
  if (!user) {
    return <div className={className}>Select a user to start chatting</div>;
  }

  return (
    <div className={className}>
      <div className="bg-purple-200 p-2 font-bold text-center">
        <span>Chatting with: {user.username}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <ul className="space-y-2">
          {user.messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${message.fromSelf ? "justify-end" : ""}`}
            >
              <div
                className={`max-w-xs p-2 rounded ${message.fromSelf ? "bg-blue-100" : "bg-gray-200"}`}
              >
                {displaySender(message, index, user.messages) && (
                  <div className="text-xs text-gray-500 mb-1">
                    {message.fromSelf ? "(You)" : user.username}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSend} className="flex p-2 border-t bg-gray-100">
        <textarea
          className="flex-1 p-2 border rounded focus:outline-none resize-none"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
