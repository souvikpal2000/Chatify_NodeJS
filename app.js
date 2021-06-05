const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./middleware/messages');
const { userJoin, getCurrentUser, userLeave, getRoomsUsers } = require("./middleware/users");

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const staticPath = __dirname + "/public";
app.use(express.static(staticPath));

io.on('connection', socket => {
    socket.on('joinroom', ({ username, room }) => {
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        //Welcome Current User
        socket.emit('message', formatMessage('Bot', 'Welcome to ChatiFy'));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit('message',formatMessage('Bot', `${user.username} has joined the Chat`));

        //Send Users and Room Info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomsUsers(user.room)
        });
    });

    //Listen for chat Message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage('Bot', `${user.username} has left the chat`));
            //Send Users and Room Info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomsUsers(user.room)
            });
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    if(!err){
        console.log(`Server listening at port ${port}`);
    }else{
        console.log("Something went Wrong");
    }
});