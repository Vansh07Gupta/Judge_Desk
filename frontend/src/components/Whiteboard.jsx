import { useRef, useState, useEffect } from "react";
import socketService from "../services/socketService";

export default function Whiteboard({ roomId }) {
  const canvasRef = useRef();
  const ctxRef = useRef();
  const drawing = useRef(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  const drawLine = ({ x0, y0, x1, y1, emit }) => {
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 + 1, y1 + 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();

    if (emit) {
      socketService.emitWhiteboardDraw(roomId, { x0, y0, x1, y1, color, lineWidth });
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseDown = (e) => {
    drawing.current = true;
    const pos = getMousePos(e);
    drawLine({ x0: pos.x, y0: pos.y, x1: pos.x, y1: pos.y, emit: true });
  };

  const onMouseMove = (e) => {
    if (!drawing.current) return;
    const pos = getMousePos(e);
    drawLine({ x0: pos.x - 1, y0: pos.y - 1, x1: pos.x, y1: pos.y, emit: true }); // ❌ Slightly off calculation
  };

  const onMouseUp = () => {
    drawing.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");

    socketService.joinWhiteboard(roomId); // ✅

    const socket = socketService.getSocket();
    socket.on("whiteboardDraw", (data) => {
      drawLine({ ...data, emit: false });
    });


  }, []);

  return (
    <div>
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
        />
      </div>
      <canvas
        ref={canvasRef}
        style={{ background: "#fff" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
    </div>
  );
}
