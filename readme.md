# JudgeDesK: Real-Time Collaborative Code Editor

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-yellow)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4)

## Overview

**JudgeDesK** is a real-time collaborative code editor platform that enables users to join coding rooms, write and execute code together, chat, video call, and use a shared whiteboard. It's perfect for remote interviews, team coding, and online classrooms.

---

## Tech Stack

### Frontend
- **React 18**
- **Vite** (for fast development and build)
- **TailwindCSS** (for modern UI styling)
- **Socket.io-client** (real-time communication)
- **@monaco-editor/react** (code editor)
- **Simple-Peer** (WebRTC video calls)
- **React Toastify** (notifications)
- **React Router DOM** (routing)

### Backend
- **Node.js** (18+ recommended)
- **Express.js** (API and static serving)
- **Socket.io** (real-time server)
- **Axios** (HTTP requests)

---

## Features

- **Real-time Collaborative Code Editing**: Multiple users can edit code together live.
- **Multi-language Support**: JavaScript, Python, Java, and C++.
- **Live Chat**: Instant messaging within the room.
- **Video Chat**: Face-to-face coding sessions using WebRTC.
- **Shared Whiteboard**: Draw, annotate, and brainstorm together.
- **Room Management**: Create, join, and leave rooms with unique IDs.
- **Code Execution**: Run code and view output instantly (for supported languages).
- **File Upload/Download**: Open code files and download your work.
- **Persistent Sessions**: Restore your session if you refresh or rejoin.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd realtime-code-editor-part-3-main
```

### 2. Install Dependencies (Backend & Frontend)
```bash
# Install backend dependencies
npm install

# Build frontend (installs frontend dependencies too)
npm run build
```

> The `build` script will automatically install frontend dependencies and build the frontend for production.

### 3. Run the Application

#### Development Mode (with hot reload)
```bash
# Start backend with nodemon (auto-restarts on changes)
npm run dev

# In a separate terminal, start the frontend for hot reload
yarn --cwd frontend dev
# or
cd frontend
npm run dev
```
- Backend: http://localhost:5000
- Frontend (dev): http://localhost:5173

#### Production Mode
```bash
# Serve both backend and built frontend
npm start
```
- App will be available at http://localhost:5000

---

## Usage

1. Open the app in your browser.
2. Create a new room or enter an existing Room ID.
3. Enter your name and join the room.
4. Start coding, chatting, video calling, or using the whiteboard with your team!

---

## Folder Structure

```
realtime-code-editor-part-3-main/
  backend/         # Express + Socket.io backend
  frontend/        # React + Vite frontend
  readme.md        # This file
```

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

---

## License

This project is licensed under the ISC License.
