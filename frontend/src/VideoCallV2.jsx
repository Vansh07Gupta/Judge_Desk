import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";

const VideoCall = ({ socket, roomId, userName }) => {
  const [peers, setPeers] = useState([]); // [{ peerId, peer }]
  const userVideoRef = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef();

  useEffect(() => {
    let cancelled = false;

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return;
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        socket.emit("join-call", { roomId, userName });

        socket.on("all-users", (users) => {
          const p = users.map((userId) => {
            const peer = createPeer(userId, stream);
            peersRef.current.push({ peerId: userId, peer });
            return { peerId: userId, peer };
          });
          setPeers(p);
        });

        socket.on("user-joined", ({ userId }) => {
          const peer = addPeer(userId, stream);
          peersRef.current.push({ peerId: userId, peer });
          setPeers((prev) => [...prev, { peerId: userId, peer }]);
        });

        socket.on("signal", ({ from, signal }) => {
          const item = peersRef.current.find((p) => p.peerId === from);
          if (item) {
            item.peer.signal(signal);
          }
        });

        socket.on("user-left", ({ userId }) => {
          const item = peersRef.current.find((p) => p.peerId === userId);
          if (item) {
            item.peer.destroy();
          }
          peersRef.current = peersRef.current.filter((p) => p.peerId !== userId);
          setPeers(peersRef.current.map((p) => ({ peerId: p.peerId, peer: p.peer })));
        });
      } catch (err) {
        console.error("Error accessing media devices", err);
      }
    };

    setupMedia();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      socket.emit("leave-call", { roomId });
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
      peersRef.current.forEach(({ peer }) => peer.destroy());
      peersRef.current = [];
      setPeers([]);
    };
  }, [socket, roomId, userName]);

  const createPeer = (userToSignal, stream) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("signal", { roomId, to: userToSignal, from: socket.id, signal });
    });
    return peer;
  };

  const addPeer = (incomingId, stream) => {
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("signal", { roomId, to: incomingId, from: socket.id, signal });
    });

    return peer;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-950 text-white h-full w-full">
      <h2 className="text-lg font-semibold">Video Chat</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <video
          muted
          ref={userVideoRef}
          autoPlay
          playsInline
          className="w-60 h-48 bg-black rounded"
        />
        {peers.map(({ peerId, peer }) => (
          <PeerVideo key={peerId} peer={peer} />
        ))}
      </div>
    </div>
  );
};

const PeerVideo = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    const handleStream = (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    };

    peer.on("stream", handleStream);

    return () => {
      peer.off("stream", handleStream);
    };
  }, [peer]);

  return (
    <video
      playsInline
      autoPlay
      ref={ref}
      className="w-60 h-48 bg-black rounded"
    />
  );
};

export default VideoCall;
