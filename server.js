import * as net from "net";
import * as env from "dotenv";

env.config();
const PORT = process.env.PORT;
const HOST = process.env.IP_ADDRESS;

const clients = [];

const server = net.createServer((socket) => {
  socket.on("connect", () => {
    //when client connects to the server
    console.log(
      `Client connected: IP=${socket.remoteAddress} PORT=${socket.remotePort}`
    );
    clients.push(socket);
  });

  socket.on("data", (data) => {
    console.log(`Received from ${socket.remoteAddress}: ${data}`);
    // Broadcast the received data to all clients except the sender
    clients.forEach((client, index) => {
      if (client !== socket) {
        client.write(`From ${socket.remoteAddress}: ${data}`);
      }
    });
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log(`Client disconnected: ${socket.remoteAddress}`);
    // Remove the client from the list
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at ${HOST}:${PORT}`);
});
