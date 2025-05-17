import { useState } from "react";
import PropTypes from 'prop-types';

// Mock Chat component for demo
const Chat = ({ socket, roomId, userName, messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && userName) {
      const messageData = {
        room: roomId,
        author: userName,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-xs min-w-[260px]">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 custom-scrollbar max-h-80">
        {messages.map((msg, index) => (
          <div key={index} className={`${msg.author === userName ? 'ml-4' : 'mr-4'}`}>
            <div className={`rounded-2xl px-4 py-3 max-w-[80%] break-words \
              ${msg.author === userName 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-gray-100 text-gray-800'}
            `}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium opacity-75">{msg.author}</span>
                <span className="text-xs opacity-75">{msg.time}</span>
              </div>
              <div className="text-sm break-words">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

Chat.propTypes = {
  socket: PropTypes.object,
  roomId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired
};

export default Chat;
