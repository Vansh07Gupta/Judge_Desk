// src/App.js
import { useEffect } from "react";
import "./App.css";
import VideoCall from "./VideoCallV2.jsx";
import Homepage from "./Homepage";
import CodeEditor from "./components/CodeEditor";
import RoomSidebar from "./components/RoomSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRoomManagement } from "./hooks/useRoomManagement";
import { useAppState } from "./hooks/useAppState";
import { useSocketConnection } from "./hooks/useSocketConnection";
import socketService from "./services/socketService";

const App = () => {
  const {
    joined,
    roomId,
    setRoomId,
    userName,
    setUserName,
    joinRoom,
    leaveRoom,
    createRoomId,
    restoreSession,
  } = useRoomManagement();

  const {
    language,
    code,
    users,
    typing,
    outPut,
    messages,
    showVideoCall,

    setLanguage,
    setCode,
    setOutPut,
    setMessages,
    handleUserJoined,
    handleCodeUpdate,
    handleUserTyping,
    handleLanguageUpdate,
    handleCodeResponse,
    handleMessage,
    handleVideoCallToggle,
    handleWhiteboardToggle,
  } = useAppState();

  useSocketConnection({
    onUserJoined: handleUserJoined,
    onCodeUpdate: handleCodeUpdate,
    onUserTyping: handleUserTyping,
    onLanguageUpdate: handleLanguageUpdate,
    onCodeResponse: handleCodeResponse,
    onMessage: handleMessage,
  });

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <>
      <ToastContainer
        autoClose={2500}
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss={false}
      />

      {joined ? (
        <div className={`editor-container flex h-screen bg-gray-950 text-white ${showVideoCall ? 'shrink' : ''}`}>
          <RoomSidebar
            socket={socketService.getSocket()}
            roomId={roomId}
            userName={userName}
            users={users}
            typing={typing}
            language={language}
            setLanguage={setLanguage}
            leaveRoom={leaveRoom}
            handleVideoCallToggle={handleVideoCallToggle}
            showVideoCall={showVideoCall}
            messages={messages}
            setMessages={setMessages}
          />

          <div className="flex-1 flex flex-col">
            <CodeEditor
              socket={socketService.getSocket()}
              roomId={roomId}
              userName={userName}
              language={language}
              setLanguage={setLanguage}
              code={code}
              setCode={setCode}
              outPut={outPut}
              setOutPut={setOutPut}
            />
          </div>

          <div
            className={`video-call-container${showVideoCall ? " open" : ""}`}
          >
            {showVideoCall && (
              <VideoCall
                socket={socketService.getSocket()}
                roomId={roomId}
                userName={userName}
              />
            )}
          </div>
        </div>
      ) : (
        <Homepage
          roomId={roomId}
          setRoomId={setRoomId}
          userName={userName}
          setUserName={setUserName}
          createRoomId={createRoomId}
          joinRoom={joinRoom}
        />
      )}
    </>
  );
};

export default App;
