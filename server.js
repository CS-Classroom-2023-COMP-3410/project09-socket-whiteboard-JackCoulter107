const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

let boardState = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current board state to the new client
  socket.emit("load-board", boardState);

  // Listen for drawing data
  socket.on("draw", (data) => {
    boardState.push(data);
    io.emit("draw", data); // broadcast drawing data
  });

  // Listen for clear board events
  socket.on("clear-board", () => {
    boardState = [];
    io.emit("clear-board");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start your server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
