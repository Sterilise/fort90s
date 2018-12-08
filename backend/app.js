var express = require('express');
var socket = require('socket.io');


//App setup
var app = express();

var server = app.listen(3000, function() {
    console.log("listening to requests on port 3000");
});

//static files
app.use(express.static("public"));


//socket setup, socket io waits for clients to make a connection and sets one up between the two
var io = socket(server);
//on connection event (with a new client) you can call callback function and store socket object

io.on("connection", function(socket){
    console.log("made socket connection", socket.id);

    socket.on("chat", function(data){
        io.sockets.emit("chat", data)
    })

    socket.on("typing", function(handler) {
        socket.broadcast.emit("typing", handler);
    })
});
