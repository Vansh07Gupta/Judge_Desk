import React, { useState } from "react";
import PropTypes from 'prop-types';
import Chat from './Chat';


const RoomSidebar = ({
  socket,
  roomId = "demo-123",
  userName = "Demo User",
  users = ["Demo User", "Alice", "Bob"],
  typing = "",
  language = "javascript",
  setLanguage = () => {},
  leaveRoom = () => {},
  handleVideoCallToggle = () => {},
  showVideoCall = false,
  messages = [],
  setMessages = () => {}
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const languageIcons = {
    javascript: "🟨",
    python: "🐍",
    java: "☕",
    cpp: "⚡"
  };

  return (
    <div className="w-80 bg-gray-950 text-white backdrop-blur-sm border-l border-gray-800 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Code Room</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex-1">
            <p className="text-sm text-gray-400">Room ID</p>
            <p className="font-mono text-sm font-semibold">{roomId}</p>
          </div>
          <button
            onClick={copyRoomId}
            className="
              px-3 py-2 rounded-lg font-medium
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-700 hover:to-purple-700
              transition-all duration-200
            "
          >
            {copySuccess || "Copy"}
          </button>
        </div>
      </div>

      {/* Users */}
      <div className="p-6 border-b border-gray-800 flex-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5  a0 015 0z"/>
          </svg>
          Users ({users.length})
        </h3>
        <div className="space-y-3">
          {users.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-white font-bold">
                {user[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <span className="font-medium">{user}</span>
                {user === userName && (
                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">You</span>
                )}
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          ))}
        </div>
        {typing && (
          <div className="mt-3 p-2 bg-blue-500/10 rounded-xl">
            <div className="flex space-x-1 mb-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm text-blue-300">{typing}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-800 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Programming Language</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="
              w-full px-4 py-2 bg-gray-800 text-white border border-gray-700
              rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-200
            "
          >
            <option value="javascript">{languageIcons.javascript} JavaScript</option>
            <option value="python">{languageIcons.python} Python</option>
            <option value="java">{languageIcons.java} Java</option>
            <option value="cpp">{languageIcons.cpp} C++</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleVideoCallToggle}
            className={`
              flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all
              ${showVideoCall
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'}
            `}
          >
            {showVideoCall ? "End Video Call" : "Start Video Call"}
          </button>
          <button
            onClick={() => window.open('/whiteboard', '_blank')}
            className="
              flex items-center justify-center px-4 py-3
              bg-purple-500 text-white rounded-xl
              hover:bg-purple-600 transition-all
            "
          >
            Open Whiteboard
          </button>
          <button
            onClick={leaveRoom}
            className="
              flex items-center justify-center px-4 py-3
              bg-gray-800 text-gray-200 rounded-xl
              hover:bg-gray-700 transition-all
            "
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-4 border-t border-gray-800">
          <h3 className="text-lg font-semibold">Chat</h3>
        </div>
        <div className="flex-1">
          <Chat
            socket={socket}
            roomId={roomId}
            userName={userName}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
};

RoomSidebar.propTypes = {
  socket: PropTypes.object,
  roomId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  typing: PropTypes.string,
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  handleVideoCallToggle: PropTypes.func.isRequired,
  showVideoCall: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired
};

export default RoomSidebar;
