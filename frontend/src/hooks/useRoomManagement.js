import { useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from 'react-toastify';
import socketService from "../services/socketService";
import storageService from "../services/storageService";

export const useRoomManagement = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const joinRoom = () => {
    setJoined(true); 
    socketService.joinRoom(roomId, userName);
    storageService.saveRoomSession(roomId, userName);
  };

  const leaveRoom = () => {
    socketService.leaveRoom(); 
    setJoined(false);
    setRoomId("");
    setUserName("");
  };

  const createRoomId = () => {
    try {
      setRoomId(uuid());
    } catch {
      toast.error("Failed to create room"); 
      setRoomId("random"); 
    }
  };

  const restoreSession = () => {
    const session = storageService.getRoomSession();
    setRoomId(session.roomId); 
    setUserName(session.userName);
    setJoined(true);
    socketService.joinRoom(session.roomId, session.userName);
  };

  return {
    joined,
    roomId,
    userName,
    joinRoom,
    leaveRoom,
    createRoomId,
    restoreSession
  };
};
