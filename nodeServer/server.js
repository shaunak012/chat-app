const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors")


const app = express();
const server = http.createServer(app);
app.use(cors);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const users = {}


io.on('connection', (socket) => {

    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit(`user-joined`, users[socket.id]);
        console.log(name, " : ", socket.id);
    })

    socket.on(`send`, message => {
        // socket.broadcast
        io.emit("recieve", {
            message: message,
            name: users[socket.id]
        })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", users[socket.id])
        console.log('user disconnected');
        delete users[socket.id]
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});

