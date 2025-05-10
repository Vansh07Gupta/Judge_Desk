import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import WhiteboardPage from "./WhiteboardPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Buffer } from 'buffer';
import process from 'process';
window.Buffer = globalThis.Buffer || Buffer;
globalThis.process = globalThis.process || process;

if (typeof globalThis.process.nextTick !== 'function') {
  globalThis.process.nextTick = (cb, ...args) => setTimeout(() => cb(...args), 0);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/whiteboard" element={<WhiteboardPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
