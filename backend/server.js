const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*'}
});

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
    console.log('Total connected:', io.engine.clientsCount);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
})