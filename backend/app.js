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
class Player {
    constructor(id) {
        this.id = id;
        this.location = { x: 0, y: 0 }
    }
}

class World {
    constructor() {
        this.players = []
        this.block = []
    }

    update() {
        
    }
}

let players = {}

io.on("connection", function(socket){
    console.log("made socket connection", socket.id);
    players[socket.id] = new Player(socket.id);

    socket.on("move", data => {
        
    });

    socket.on("rotate", data => {

    });

    socket.on("fire", data => {

    });

    socket.on("break", data => {

    });

    socket.on("place", data => {

    })

    socket.on("chat", function(data){
        io.sockets.emit("chat", data)
    })

    socket.on("typing", function(handler) {
        socket.broadcast.emit("typing", handler);
    })
});
