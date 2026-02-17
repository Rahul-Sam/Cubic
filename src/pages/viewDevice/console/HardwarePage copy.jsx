import React, { useEffect, useRef, useState } from "react";
import ARMConsole from "./ARMConsole";

const SOCKET_URL = "ws://164.52.219.33:8080/ws/console";

const HardwarePage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      setConnected(true);

      // Send authentication payload after connection
      socket.send(
        JSON.stringify({
          api_key:
            "edda69508d03b9e2be67.660f25692384b5026783a8928ae6c473c881cdd6088a11cd4662364f3973c9a4b47772ee60c8752bcf622452c02b987ecafec9a5610a83d02012440badf0dbee",
          instance_id: "94232b97-b26b-400b-9777-a70470081fb0",
        })
      );
    };

    socket.onmessage = (event) => {
      console.log("Received:", event.data);

      // If backend sends JSON
      try {
        const parsed = JSON.parse(event.data);
        setLogs((prev) => [...prev, parsed.message || event.data]);
      } catch {
        // If backend sends plain text
        setLogs((prev) => [...prev, event.data]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ARMConsole
      logs={logs}
      connected={connected}
      height={800}
      title="Console"
    />
  );
};

export default HardwarePage;
