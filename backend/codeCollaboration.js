import axios from "axios";

export class CodeCollaborationManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
    this.compileCooldown = new Map();
  }

  handleConnection(socket) {
    let currentRoom = null;
    let currentUser = null;

    socket.on("join", ({ roomId, userName }) => {
      if (currentRoom) {
        socket.leave(currentRoom);
        this.rooms.get(currentRoom).users.delete(currentUser);
        this.io.to(currentRoom).emit(
          "userJoined",
          Array.from(this.rooms.get(currentRoom).users)
        );
      }

      currentRoom = roomId;
      currentUser = userName;

      socket.join(roomId);

      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, { 
          users: new Set(), 
          code: "// start code here",
          messages: [] 
        });
      }

      this.rooms.get(roomId).users.add(userName);

      socket.emit("codeUpdate", this.rooms.get(roomId).code);
      this.io.to(roomId).emit("userJoined", Array.from(this.rooms.get(currentRoom).users));
    });

    socket.on("codeChange", ({ roomId, code }) => {
      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).code = code;
      }
      socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("leaveRoom", () => {
      if (currentRoom && currentUser) {
        this.rooms.get(currentRoom).users.delete(currentUser);
        this.io.to(currentRoom).emit(
          "userJoined",
          Array.from(this.rooms.get(currentRoom).users)
        );

        socket.leave(currentRoom);

        currentRoom = null;
        currentUser = null;
      }
    });

    socket.on("typing", ({ roomId, userName }) => {
      socket.to(roomId).emit("userTyping", userName);
    });

    socket.on("languageChange", ({ roomId, language }) => {
      this.io.to(roomId).emit("languageUpdate", language);
    });

    socket.on("compileCode", async ({ code, roomId, language, version, input }) => {
      if (!this.rooms.has(roomId)) return;

      const now = Date.now();
      const lastCompile = this.compileCooldown.get(socket.id) || 0;

      if (now - lastCompile < 200) {
        socket.emit("codeResponse", {
          run: { output: "⚠️ You're sending compile requests too quickly. Please wait." },
        });
        return;
      }

      this.compileCooldown.set(socket.id, now);

      try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language,
          version,
          files: [{ content: code }],
          stdin: input,
        });

        this.rooms.get(roomId).output = response.data.run.output;
        this.io.to(roomId).emit("codeResponse", response.data);
      } catch (err) {
        console.error("Compile Error:", err?.response?.data || err.message);
        socket.emit("codeResponse", {
          run: { output: "❌ Compilation failed. Try again later." },
        });
      }
    });

    socket.on("sendMessage", (messageData) => {
      if (this.rooms.has(messageData.room)) {
        this.rooms.get(messageData.room).messages.push(messageData);
        this.io.to(messageData.room).emit("message", messageData);
      }
    });

    socket.on("disconnect", () => {
      if (currentRoom && currentUser) {
        this.rooms.get(currentRoom).users.delete(currentUser);
        this.io.to(currentRoom).emit(
          "userJoined",
          Array.from(this.rooms.get(currentRoom).users)
        );
      }
      this.compileCooldown.delete(socket.id);
    });
  }
} 