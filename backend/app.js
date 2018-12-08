const express = require('express');
const socket = require('socket.io');
// const {Vec2, World} = require("planck-js")




//App setup
var app = express();

var server = app.listen(3000, function() {
    console.log("listening to requests on port 3000");
});

//static files
app.use(express.static("../frontend"));


//socket setup, socket io waits for clients to make a connection and sets one up between the two
var io = socket(server);
//on connection event (with a new client) you can call callback function and store socket object
class Player {
    constructor(soc) {
        this.id = soc.id
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

class GameWorld {
    constructor(size) {
        this.players = {}
        this.block = []
        const num_blocks = 50;
        this.size = size * num_blocks;

        // this.physicsWorld = World({
        //     gravity: Vec2(0, 0)
        // });
    }

    update() {
        
    }
}

let world = new GameWorld();

io.on("connection", function(socket){
    console.log("made socket connection", socket.id);
    let player = new Player(socket);
    world.players[socket.id] = player

    // setTimeout(() => {
    socket.emit("world:full", world) // we send ourselves the 
    socket.broadcast.emit("player:new", player) // we don't need to send ourselvs.
    // });

    socket.on("move", data => {
        player.location[0] += data.direction[0]*5
        player.location[1] += data.direction[1]*-5
        console.log(player, data)
        io.emit("player:update", player)
    });

    socket.on("rotate", data => {
        player.rotation = data.rotation
        io.emit("player:update", player)
    });

    socket.on("fire", data => {
        
    });

    socket.on("break", data => {

    });

    socket.on("place", data => {
        
    })

    // socket.on("chat", function(data){
    //     io.sockets.emit("chat", data)
    // })

    // socket.on("typing", function(handler) {
    //     socket.broadcast.emit("typing", handler);
    // })
});
