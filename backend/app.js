const express = require('express');
const socket = require('socket.io');
const planck = require("planck-js")
const {Vec2, World} = planck



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
    constructor(world, soc) {
        this.id = soc.id
        this.location = [100, 100]
        this.speed = [0, 0]
        this.rotation = 0
        this.dirty = false
        this.hp = 100
        this.armor = 100

        var ground = world.getPhysics().createBody({
          type: 'static',
          position: Vec2(0, 0)
        });

        ground.createFixture({
          shape: planck.Circle(Vec2(0.0, 0.0), 5)
        });

        this.getSocket = () => soc
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

        let physicsWorld = World({
            gravity: Vec2(0, 0)
        });

        this.getPhysics = () => physicsWorld

    }

    update() {
        
    }
}

let world = new GameWorld();

const damp = 5;

setTimeout(() => {
    for(var key in GameWorld.players){
        var player = GameWorld.players[key]

        player.location[0] += player.speed[0]*damp;
        player.location[1] += player.speed[1]*damp;
    }
    io.emit("world:full", world)
    
}, 1000/30)

io.on("connection", function(socket){
    console.log("made socket connection", socket.id);
    let player = new Player(world, socket);
    world.players[socket.id] = player

    
    // setTimeout(() => {
    socket.emit("world:full", world) // we send ourselves the 
    socket.broadcast.emit("player:new", player) // we don't need to send ourselvs.
    // });

    socket.on("player:speed", data => {
        player.speed[0] += data.speed[0]
        player.speed[1] += data.speed[1]
        // console.log(player, data)
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

    socket.on('disconnect', (reason) => {
        socket.broadcast.emit("player:disconnect", socket.id) // we don't need to send ourselvs.
        delete world.players[socket.id]
    });

    // socket.on("chat", function(data){
    //     io.sockets.emit("chat", data)
    // })

    // socket.on("typing", function(handler) {
    //     socket.broadcast.emit("typing", handler);
    // })
});
