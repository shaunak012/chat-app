const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors")


const app = express();
const server = http.createServer(app);
app.use(cors);

const io = new Server(server, {
    cors: {
        origin: process.env.PORT || "http://localhost:3000"
    }
});

const users = {}
const others = []

io.on('connection', (socket) => {

    socket.on("new-user-joined", name => {
        socket.join("global")
        others.push("global")
        users[socket.id] = name;
        socket.broadcast.to("global").emit(`user-joined`, users[socket.id]);
        console.log(name, " : connected");
    })

    socket.on(`send`, data => {
        // socket.broadcast
        io.to(data.currentChat).emit("recieve", {
            message: data.message,
            name: users[socket.id]
        })
    })
    socket.on("join-old-chat", chatName => {
        others.map((chats) => {
            socket.leave(chats)
        })
        socket.join(chatName)
        socket.broadcast.to(chatName).emit(`user-joined`, users[socket.id]);
    })
    socket.on("join-new-group", (name) => {
        socket.broadcast.to(name).emit(`user-joined`, users[socket.id]);
        others.push(name)
        others.map((chats) => {
            socket.leave(chats)
        })
        socket.join(name);
        socket.emit("clear")
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit("user-disconnected", users[socket.id])
        console.log(users[socket.id], ': disconnected');
        delete users[socket.id]
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});

