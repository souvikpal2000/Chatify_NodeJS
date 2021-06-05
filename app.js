const express = require("express");
const app = express();

const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = require('socket.io')(server);

const staticPath = __dirname + "/public";
app.use(express.static(staticPath));

io.on('connection', client => {
    console.log('New WS Connection....');
});

const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    if(!err){
        console.log(`Server listening at port ${port}`);
    }else{
        console.log("Something went Wrong");
    }
});