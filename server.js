
import * as env from "dotenv";
import express from 'express';
import * as http from 'http';
import { Server as socketIo } from 'socket.io';

env.config();
const PORT = process.env.PORT;
const HOST = process.env.IP_ADDRESS;

const app= express();
const server= http.createServer(app);
const io= new socketIo(server)

io.on('connection', (socket)=>{
  console.log('client connected ' + socket.id);

  socket.on('message',(message)=>{
    console.log('Message received:', message);
    socket.broadcast.emit('message',message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

});

server.listen(PORT, HOST, ()=>{
  console.log('server listening on port '+ PORT)
});

