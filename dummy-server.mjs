import { Server } from "socket.io";

const io = new Server(5000, {
  cors: {
    origin: "*",
  },
});

console.log("Dummy ARM Console Server running on port 5000");

io.on("connection", (socket) => {
  console.log("Client connected");

  let counter = 0;

  const interval = setInterval(() => {
    counter++;

    const fakeLogs = [
      "Booting ARM Cortex-M4...",
      "Initializing memory...",
      "Loading firmware...",
      "Connecting to network...",
      "Device Ready.",
      `Sensor Value: ${Math.floor(Math.random() * 100)}`
    ];

    socket.emit(
      "console_output",
      `[${new Date().toLocaleTimeString()}] ${
        fakeLogs[counter % fakeLogs.length]
      }`
    );
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});
