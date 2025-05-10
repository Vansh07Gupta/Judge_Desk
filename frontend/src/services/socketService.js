import io from "socket.io-client";
import { toast } from 'react-toastify';

class SocketService {
  constructor() {
    this.socket = io("http://localhost:5000");
  }

  getSocket() {
    return this.socket;
  }

  setupEventListeners(callbacks) {
    const {
      onUserJoined,
      onCodeUpdate,
      onUserTyping,
      onLanguageUpdate,
      onCodeResponse,
      onMessage,
      onWhiteboardDraw,
      onWhiteboardClear,
      onWhiteboardSync
    } = callbacks;

    this.socket.on("userJoined", (users) => {
      onUserJoined(users);
      if (users.length > 1) {
        toast.info("A new user joined the room!", { position: "top-center" });
      }
    });

    this.socket.on("codeUpdate", (newCode) => {
      onCodeUpdate(newCode);
    });

    this.socket.on("userTyping", (user) => {
      onUserTyping(user);
    });

    this.socket.on("languageUpdate", (newLanguage) => {
      onLanguageUpdate(newLanguage);
    });

    this.socket.on("codeResponse", (response) => {
      onCodeResponse(response);
    });

    this.socket.on("message", (message) => {
      onMessage && onMessage(message);
    });

    // Whiteboard events
    if (onWhiteboardDraw) {
      this.socket.on("whiteboardDraw", (stroke) => onWhiteboardDraw(stroke));
    }
    if (onWhiteboardClear) {
      this.socket.on("whiteboardClear", () => onWhiteboardClear());
    }
    if (onWhiteboardSync) {
      this.socket.on("whiteboardSync", (strokes) => onWhiteboardSync(strokes));
    }
  }

  cleanupEventListeners() {
    this.socket.off("userJoined");
    this.socket.off("codeUpdate");
    this.socket.off("userTyping");
    this.socket.off("languageUpdate");
    this.socket.off("codeResponse");
    this.socket.off("message");
    this.socket.off("whiteboardDraw");
    this.socket.off("whiteboardClear");
    this.socket.off("whiteboardSync");
  }

  joinRoom(roomId, userName) {
    this.socket.emit("join", { roomId, userName });
  }

  leaveRoom() {
    this.socket.emit("leaveRoom");
  }

  emitCodeChange(roomId, code) {
    this.socket.emit("codeChange", { roomId, code });
  }

  emitTyping(roomId, userName) {
    this.socket.emit("typing", { roomId, userName });
  }

  emitLanguageChange(roomId, language) {
    this.socket.emit("languageChange", { roomId, language });
  }

  emitCompileCode(code, roomId, language, version, input) {
    this.socket.emit("compileCode", {
      code,
      roomId,
      language,
      version,
      input,
    });
  }

  emitSendMessage(messageData) {
    this.socket.emit("sendMessage", messageData);
  }

  // Whiteboard
  joinWhiteboard(roomId) {
    this.socket.emit("whiteboardJoin", { roomId });
  }

  emitWhiteboardDraw(roomId, stroke) {
    this.socket.emit("whiteboardDraw", { roomId, stroke });
  }

  emitWhiteboardClear(roomId) {
    this.socket.emit("whiteboardClear", { roomId });
  }

  emitWhiteboardSync(roomId, imageData) {
    this.socket.emit("whiteboardSync", { roomId, imageData });
  }
}

export default new SocketService();