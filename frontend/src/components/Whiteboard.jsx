import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import socketService from "../services/socketService";

export default function Whiteboard({ roomId = "demo-room" }) {
  const wrapperRef = useRef(null);
  const toolbarRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const historyRef = useRef([]);
  const stepRef = useRef(-1);

  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState("brush");

  const saveHistory = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    historyRef.current = historyRef.current.slice(0, stepRef.current + 1);
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    stepRef.current = historyRef.current.length - 1;
  };

  const restoreHistory = (index) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!historyRef.current[index]) return;
    ctx.putImageData(historyRef.current[index], 0, 0);
  };

  const undo = () => {
    if (stepRef.current > 0) {
      stepRef.current -= 1;
      restoreHistory(stepRef.current);
      socketService.emitWhiteboardSync(roomId, historyRef.current[stepRef.current]);
    }
  };

  const redo = () => {
    if (stepRef.current < historyRef.current.length - 1) {
      stepRef.current += 1;
      restoreHistory(stepRef.current);
      socketService.emitWhiteboardSync(roomId, historyRef.current[stepRef.current]);
    }
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => {
    drawing.current = true;
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const { x, y } = getPos(e);
    const { lastX, lastY } = draw;
    if (lastX !== undefined) {
      drawLine({ x0: lastX, y0: lastY, x1: x, y1: y, emit: true });
    }
    draw.lastX = x;
    draw.lastY = y;
  };

  const endDraw = () => {
    drawing.current = false;
    draw.lastX = draw.lastY = undefined;
    ctxRef.current.closePath();
    saveHistory();
  };

  const drawLine = ({ x0, y0, x1, y1, color: strokeColor = color, width = lineWidth, emit }) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = tool === "eraser" ? "#1f2937" : strokeColor;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (!emit) return;
    socketService.emitWhiteboardDraw(roomId, { x0, y0, x1, y1, color: ctx.strokeStyle, width });
  };

  const clearCanvas = (emit = false) => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    if (emit) socketService.emitWhiteboardClear(roomId);
    saveHistory();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `whiteboard_${roomId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = wrapperRef.current;
      if (!canvas || !parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight - toolbarRef.current.clientHeight;
      ctxRef.current = canvas.getContext("2d");
    };

    resizeCanvas();
    saveHistory();
    socketService.joinWhiteboard(roomId);

    const socket = socketService.getSocket();
    socket.on("whiteboardDraw", stroke => drawLine({ ...stroke, emit: false }));
    socket.on("whiteboardClear", () => clearCanvas(false));
    socket.on("whiteboardSync", imageData => ctxRef.current.putImageData(imageData, 0, 0));

    window.addEventListener("resize", resizeCanvas);
    return () => {
      socket.off("whiteboardDraw");
      socket.off("whiteboardClear");
      socket.off("whiteboardSync");
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [roomId]);

  return (
    <div ref={wrapperRef} className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4 space-x-6">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTool("brush")}
              className={`
                flex items-center px-4 py-2 rounded-xl font-medium transition-all
                ${tool === "brush"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"}
              `}
            >
              Brush
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`
                flex items-center px-4 py-2 rounded-xl font-medium transition-all
                ${tool === "eraser"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"}
              `}
            >
              Eraser
            </button>
          </div>

          {/* Color & Width */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Color:</label>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-10 h-10 p-0 border-2 border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Width:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={e => setLineWidth(Number(e.target.value))}
                className="w-24 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-6 text-center text-sm">{lineWidth}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={stepRef.current <= 0}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={stepRef.current >= historyRef.current.length - 1}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50"
            >
              Redo
            </button>
            <button
              onClick={() => clearCanvas(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Clear
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-gray-800 rounded-xl cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseOut={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

Whiteboard.propTypes = {
  roomId: PropTypes.string.isRequired,
};
