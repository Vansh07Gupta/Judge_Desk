import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { CodeCollaborationManager } from "./codeCollaboration.js";
import { VideoCallManager } from "./videoCallNew.js";
import { WhiteboardManager } from "./whiteboard.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  },
  // Add these options for better WebRTC support
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

const codeCollaborationManager = new CodeCollaborationManager(io);
const videoCallManager = new VideoCallManager(io);
const whiteboardManager = new WhiteboardManager(io);

// Connection tracking for debugging
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  connectedUsers.set(socket.id, {
    connectedAt: new Date(),
    lastActivity: new Date()
  });

  // Update last activity on any event
  socket.use((packet, next) => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      userInfo.lastActivity = new Date();
    }
    next();
  });

  // Handle connection to different managers
  try {
    codeCollaborationManager.handleConnection(socket);
    videoCallManager.handleConnection(socket);
    whiteboardManager.handleConnection(socket);
  } catch (error) {
    console.error(`Error setting up managers for socket ${socket.id}:`, error);
  }

  // Handle socket errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User Disconnected: ${socket.id}, Reason: ${reason}`);
    connectedUsers.delete(socket.id);
    
    // Log remaining connections
    console.log(`Active connections: ${connectedUsers.size}`);
  });

  // Optional: Add a heartbeat/ping mechanism
  socket.on("ping", () => {
    socket.emit("pong");
  });
});

// Error handling for the server
server.on("error", (error) => {
  console.error("Server error:", error);
});

io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    activeConnections: connectedUsers.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Optional: Add a debug endpoint to see room states
app.get("/debug/rooms", (req, res) => {
  if (process.env.NODE_ENV === "development") {
    res.json({
      videoRooms: videoCallManager.getAllRooms(),
      activeConnections: Array.from(connectedUsers.keys())
    });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

server.listen(port, () => {
  console.log("Server is running on port", port);
  console.log(`Health check available at http://localhost:${port}/health`);
  if (process.env.NODE_ENV === "development") {
    console.log(`Debug endpoint available at http://localhost:${port}/debug/rooms`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});