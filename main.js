import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", (event) => {
  if (!drawing) return;

  const data = {
    x: event.clientX - canvas.offsetLeft,
    y: event.clientY - canvas.offsetTop
  };

  socket.emit("draw", data);
});

// Receive drawing data from server
socket.on("draw", (data) => {
  ctx.fillStyle = "black";
  ctx.fillRect(data.x, data.y, 5, 5);
});

// Clear board button event
document.getElementById("clear-btn").addEventListener("click", () => {
  socket.emit("clear-board");
});

// Listen for clear event from server
socket.on("clear-board", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Load existing board state on connection
socket.on("load-board", (boardState) => {
  boardState.forEach(data => {
    ctx.fillStyle = "black";
    ctx.fillRect(data.x, data.y, 5, 5);
  });
});
