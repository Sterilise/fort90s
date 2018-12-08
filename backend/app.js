const express = require('express');
const socket = require('socket.io');
const planck = require("planck-js")
let {Vec2} = planck

var physics_world = planck.World({
    gravity: Vec2(0, 0)
});


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
    constructor(soc) {
        this.socket = soc
        this.location = [0, 0]
        this.rotation = 0
        this.dirty = false
    }
}


class Block {
    constructor() {
        this.location = [0, 0]// blocks have fixed size
        this.dirty = false
    }
}

class World {
    constructor(size) {
        this.players = []
        this.block = []
        const num_blocks = 50;
        this.size = size * num_blocks;

    }

    update() {
        
    }
}

let world = new World();

io.on("connection", function(socket){
    console.log("made socket connection", socket.id);
    let player = new Player(socket);
    world.players.push(player)


    io.emit("player:new", player)
    socket.on("move", data => {
        player.location[0] + data.direction[0]
        player.location[1] + data.direction[1]
        io.emit("player", player)
    });

    socket.on("rotate", data => {
        player.rotation = data.rotation
        io.emit("player", player)
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
