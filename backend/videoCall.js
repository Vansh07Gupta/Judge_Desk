export class VideoCallManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); 
  }

  handleConnection(socket) {
    const addUser = (roomId, socketId) => {
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(socketId);
    };

    const removeUser = (roomId, socketId) => {
      if (!this.rooms.has(roomId)) return;
      const set = this.rooms.get(roomId);
      set.delete(socketId);
      if (set.size === 0) this.rooms.delete(roomId);
    };

    socket.on("join-call", ({ roomId, userName }) => {
      socket.join(roomId);
      addUser(roomId, socket.id);

      const otherUsers = [...this.rooms.get(roomId)].filter(
        (id) => id !== socket.id
      );
      socket.emit("all-users", otherUsers);
      socket.to(roomId).emit("user-joined", { userId: socket.id, userName });
    });

    socket.on("signal", ({ roomId, to, from, signal }) => {
      this.io.to(to).emit("signal", { from, signal });
    });

    socket.on("leave-call", ({ roomId }) => {
      socket.to(roomId).emit("user-left", { userId: socket.id });
      socket.leave(roomId);
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        socket.to(roomId).emit("user-left", { userId: socket.id });
        removeUser(roomId, socket.id);
      }
    });
  }
}
