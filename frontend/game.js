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

socket.on("typing", function(handler) {
    console.log(handler);
    feedback.innerHTML = "<p><em>" + handler + "is typing a message... </em></p>"; 
});

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