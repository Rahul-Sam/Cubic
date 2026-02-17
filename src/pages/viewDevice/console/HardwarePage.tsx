import React, { useEffect, useRef, useState } from "react";
import ARMConsole from "./ARMConsole";

const SOCKET_URL = "wss://cubic.judgeindiasolutions.com/api/ws/console";

const HardwarePage = () => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const socket = new WebSocket(SOCKET_URL);
    socket.binaryType = "arraybuffer"; // IMPORTANT

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);

      // Send auth payload
      socket.send(
        JSON.stringify({
          api_key:
            "edda69508d03b9e2be67.660f25692384b5026783a8928ae6c473c881cdd6088a11cd4662364f3973c9a4b47772ee60c8752bcf622452c02b987ecafec9a5610a83d02012440badf0dbee",
          instance_id: "94232b97-b26b-400b-9777-a70470081fb0",
        })
      );
    };

    socket.onmessage = (event) => {
      if (!socketRef.current) return;

      let text = "";

      if (event.data instanceof ArrayBuffer) {
        text = new TextDecoder().decode(event.data);
      } else {
        text = event.data;
      }

      // Send stream directly to terminal
      window.dispatchEvent(
        new CustomEvent("terminal-data", { detail: text })
      );
    };

    socket.onclose = () => {
      setConnected(false);

      reconnectRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    socket.onerror = () => {
      socket.close();
    };
  };

  useEffect(() => {
    connect();

    return () => {
      reconnectRef.current && clearTimeout(reconnectRef.current);
      socketRef.current?.close();
    };
  }, []);

  // 🔥 Send RAW keystrokes
  const sendRaw = (data: string) => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(data);
    }
  };

  return (
    <ARMConsole
      connected={connected}
      height="800"
      title="Console"
      onDataSend={sendRaw}
    />
  );
};

export default HardwarePage;
