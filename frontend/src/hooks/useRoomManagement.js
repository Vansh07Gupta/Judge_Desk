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
    if (roomId && userName) {
      socketService.joinRoom(roomId, userName);
      setJoined(true);
      storageService.saveRoomSession(roomId, userName);
    }
  };

  const leaveRoom = () => {
    socketService.leaveRoom();
    setJoined(false);
    setRoomId("");
    setUserName("");
    storageService.clearAllSessionData();
  };

  const createRoomId = () => {
    const newRoomId = uuid();
    setRoomId(newRoomId);
    toast.success("New Room ID created!", { position: "top-center" });
  };

  const restoreSession = () => {
    const { roomId: savedRoomId, userName: savedUserName } = storageService.getRoomSession();
    if (savedRoomId && savedUserName) {
      setRoomId(savedRoomId);
      setUserName(savedUserName);
      setJoined(true);
      socketService.joinRoom(savedRoomId, savedUserName);
      return true;
    }
    return false;
  };

  return {
    joined,
    setJoined,
    roomId,
    setRoomId,
    userName,
    setUserName,
    joinRoom,
    leaveRoom,
    createRoomId,
    restoreSession
  };
}; 