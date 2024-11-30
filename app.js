require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
let visitors = new Set();
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");
  console.log(socket.id);
  visitors.add(socket.id);
  console.log(visitors);

  io.emit("visitors-count", visitors.size);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    visitors.delete(socket.id);
    console.log(visitors);
    io.emit("visitors-count", visitors.size);
  });
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
