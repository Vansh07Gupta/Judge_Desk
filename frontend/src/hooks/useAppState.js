import { useState, useEffect } from "react";
import storageService from "../services/storageService";

export const useAppState = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [messages, setMessages] = useState([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  // Restore code from localStorage on load
  useEffect(() => {
    const savedCode = storageService.getCode();
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Restore language from localStorage on load
  useEffect(() => {
    const savedLanguage = storageService.getLanguage();
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Restore video call and whiteboard state on load
  useEffect(() => {
    const wasInVideoCall = storageService.getVideoCallState();
    if (wasInVideoCall) {
      setShowVideoCall(true);
      setShowWhiteboard(true);
    }
  }, []);

  const handleUserJoined = (users) => {
    setUsers(users);
  };

  const handleCodeUpdate = (newCode) => {
    setCode(newCode);
  };

  const handleUserTyping = (user) => {
    setTyping(`${user.slice(0, 8)}... is Typing`);
    setTimeout(() => setTyping(""), 2000);
  };

  const handleLanguageUpdate = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleCodeResponse = (response) => {
    setOutPut(response.run.output);
  };

  const handleMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleVideoCallToggle = () => {
    const newState = !showVideoCall;
    setShowVideoCall(newState);
    storageService.saveVideoCallState(newState);
  };

  const handleWhiteboardToggle = () => {
    const newState = !showWhiteboard;
    setShowWhiteboard(newState);
    storageService.saveWhiteboardState(newState);
  };

  const updateCode = (newCode) => {
    setCode(newCode);
    storageService.saveCode(newCode);
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    storageService.saveLanguage(newLanguage);
  };

  return {
    // State
    language,
    code,
    users,
    typing,
    outPut,
    messages,
    showVideoCall,
    showWhiteboard,
    
    // Setters
    setLanguage: updateLanguage,
    setCode: updateCode,
    setUsers,
    setTyping,
    setOutPut,
    setMessages,
    setShowVideoCall,
    setShowWhiteboard,
    
    // Event handlers
    handleUserJoined,
    handleCodeUpdate,
    handleUserTyping,
    handleLanguageUpdate,
    handleCodeResponse,
    handleMessage,
    handleVideoCallToggle,
    handleWhiteboardToggle
  };
}; 