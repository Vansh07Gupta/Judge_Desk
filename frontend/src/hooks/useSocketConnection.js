import { useEffect } from "react";
import socketService from "../services/socketService";

export const useSocketConnection = (eventHandlers) => {
  useEffect(() => {
    socketService.setupEventListeners(eventHandlers);

    const handleBeforeUnload = () => {
      socketService.leaveRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socketService.cleanupEventListeners();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [eventHandlers]);
}; 