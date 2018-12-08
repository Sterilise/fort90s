//other clientside events


let players = {

}

/*

Do not need this event
message.addEventListener("keypress", function(){
    if(handle.value != null) {
        socket.emit("typing", handle.value);
    }
})*/

//listen for server events
// socket.on("chat", function(data) {
//     output.innerHTML += "<p><strong>" +data.handle + ":</strong>"
//     + data.message + "</p>";
//     feedback.innerHTML = "";
// });

//emit events
//move rotate and fire


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
	let socket = io.connect("http://127.0.0.1:3000")
 
	document.addEventListener("keydown", function(event){
    key = event.which //the key number
    if(key == 87) {
        //if the key is equal to w, move up
        speedUpdate(0,1)
    } else if(key == 83) {
        //if the key is equal to s, move down
        speedUpdate(0,-1)
    } else if(key == 65) {
        //if the key is equal to a move left
        speedUpdate(-1,0)
    } else if(key == 68) {
        //if the key is equal to d move right
        speedUpdate(1,0)
    }
    })
    
    document.addEventListener("keyup", function(event){
        key = event.which //the key number
        if(key == 87) {
            //if the key is equal to w, stop moving up
            speedUpdate(0,-1)
        } else if(key == 83) {
            //if the key is equal to s,stop moving down
            speedUpdate(0,1)
        } else if(key == 65) {
            //if the key is equal, stop moving left
            speedUpdate(1,0)
        } else if(key == 68) {
            //if the key is equal, stop moving right
            speedUpdate(-1,0)
        }
        })

	socket.on("player:new", function(player) {
		console.log("player:new")
		let playerSprite = new PIXI.Sprite(PIXI.loader.resources["assets/textures/player.png"].texture);
		playerSprite.name = player.id
		app.stage.addChild(playerSprite);
		players[player.id] = { player, sprite: playerSprite }
		
	})

	socket.on("player:update", function(player) {
		console.log("player:update", players[player.id])
		players[player.id].player = player
		players[player.id].sprite.x = player.location[0]
		players[player.id].sprite.y = player.location[1]

	})

	socket.on("world:full", data => {
		for(let key in data.players){
            let playerSprite = new PIXI.Sprite(PIXI.loader.resources["assets/textures/player.png"].texture);
						let player = data.players[key]
						players[key] = { player, sprite: playerSprite}
						playerSprite.x = player.location[0]
						playerSprite.y = player.location[1]
						app.stage.addChild(playerSprite)
        }
	})

	

  //Create the player sprite
  
    function speedUpdate(speedXIncrement, speedYIncrement) {
        socket.emit("speed:update",{
                speeds : [speedXIncrement, speedYIncrement]
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


    //pixi canvas events
    app.renderer.view.addEventListener("mousemove", function(event) {
    console.log(event.clientX)
    console.log(event.clientY)
    })


    app.renderer.view.addEventListener("click", function(event) {
        socket.emit("click", {

        });
    })
}











