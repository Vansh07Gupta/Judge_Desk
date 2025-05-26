export class WhiteboardManager {
  constructor(io) {
    this.io = io;
    this.boards = new Map();
  }
  handleConnection(socket) {
    let currentRoom = null;
    socket.on("whiteboardJoin", ({ roomId }) => {
      currentRoom = roomId;
      socket.join(roomId);
      if (!this.boards.has(roomId)) {
        this.boards.set(roomId, []);
      }
      socket.emit("whiteboardSync", this.boards.get(roomId));
    });

    socket.on("whiteboardDraw", ({ roomId, stroke }) => {
      if (!this.boards.has(roomId)) return;
      this.boards.get(roomId).push(stroke);
      socket.to(roomId).emit("whiteboardDraw", stroke);
    });

    socket.on("whiteboardClear", ({ roomId }) => {
      this.boards.set(roomId, []);
      this.io.to(roomId).emit("whiteboardClear");
    });

    socket.on("disconnect", () => {
    });
  }
}
