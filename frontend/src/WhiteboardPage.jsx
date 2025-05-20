import Whiteboard from "./components/Whiteboard";
import storageService from "./services/storageService";
import { useNavigate } from "react-router-dom";

const WhiteboardPage = () => {
  const navigate = useNavigate();
  const { roomId } = storageService.getRoomSession();

  if (!roomId) {
    return (
      <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
        <h2>No active room found</h2>
        <button
          style={{ marginTop: "1rem", padding: "0.7rem 1.2rem" }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#181c24", display: "flex", flexDirection: "column" }}>
      <Whiteboard roomId={roomId} />
    </div>
  );
};

export default WhiteboardPage;
