//Make connection
var socket = io.connect('http://localhost:3000');

//Query Document Object Model, storing elements in variables
var message = document.getElementById('message'),
    handle = document.getElementById("handle"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback");



//other clientside events
document.addEventListener("keydown", function(event){
    key = event.which //the key number
    
    if(key == 87) {
        //if the key is equal to w, move up
        move(0,1);
    } else if(key == 83) {
        //if the key is equal to s, move down
        move(0,-1);
    } else if(key == 65) {
        //if the key is equal to a move left
        move(-1,0);
    } else if(key == 68) {
        //if the key is equal to d move right
        move(1,0);
    }
})



/*

Do not need this event
message.addEventListener("keypress", function(){
    if(handle.value != null) {
        socket.emit("typing", handle.value);
    }
})*/

//listen for server events
socket.on("chat", function(data) {
    output.innerHTML += "<p><strong>" +data.handle + ":</strong>"
    + data.message + "</p>";
    feedback.innerHTML = "";
});

socket.on("player:new", function(player) {
    if(player.id != socket.id) {

    }
})

socket.on("player:update", function(player) {
    app.stage.children[0].position.x = player.location[0]
    app.stage.children[0].position.y = player.location[1]
} )

//emit events
//move rotate and fire
function move(xDirection, yDirection) {
    socket.emit("move",{
        direction : [xDirection,yDirection]
    });
}

function rotate(angle) {
    socket.emit("rotate", {
        bearing : angle
    })
}

function fire() {
    socket.emit("fire", {
        
    })
}

function connected() {
    socket.emit("connect", {

    });
}









//Create a Pixi Application
let app = new PIXI.Application({ 
    width: window.innerWidth, 
    height: window.innerHeight,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

//makes the canvas fill the whole screen.
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
PIXI.loader
  .add("assets/textures/player.png")
  .load(setup);

//This `setup` function will run when the image has loaded
function setup() {

  //Create the player sprite
  let player = new PIXI.Sprite(PIXI.loader.resources["assets/textures/player.png"].texture);
  
  //Add the cat to the stage
  app.stage.addChild(player);

  connected();
}

app.renderer.view.addEventListener("click", function(event) {
    socket.emit("click", {

    });
})







