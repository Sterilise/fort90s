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

	function updatePlayerSprite(sprite, player) {
		sprite.x = player.location[0]
		sprite.y = player.location[1]
		sprite.rotation = player.rotation;
	}

	function createPlayerSprite(player) {
		let playerSprite = new PIXI.Sprite(PIXI.loader.resources["assets/textures/player.png"].texture);
		playerSprite.name = player.id
		return playerSprite
	}

	socket.on("player:new", function(player) {
		console.log("player:new")
		let sprite = createPlayerSprite(player)
		app.stage.addChild(sprite);
		players[player.id] = { player, sprite }
		
	})

	socket.on("player:update", function(player) {
		console.log("player:update", players[player.id])
		players[player.id].player = player
		updatePlayerSprite(players[socket.id].sprite, player)


	})

	socket.on("world:full", data => {
		for(let key in data.players){
			let player = data.players[key]
			let sprite = createPlayerSprite(player)
			players[key] = { player, sprite }
			updatePlayerSprite(sprite, player)

			app.stage.addChild(sprite)
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
          rotation: angle
        })
    }

    function fire() {
        socket.emit("fire", {
                
        })
    }


    //pixi canvas events
    app.renderer.view.addEventListener("mousemove", function(event) {
			// console.log(event.clientX)
			// console.log(event.clientY)
			
			 

			let angleRad = Math.atan2(players[socket.id].player.location[0] - event.clientX,
				players[socket.id].player.location[1] - event.clientY);


			players[socket.id].sprite.rotation = -angleRad - Math.PI/2;
			rotate(-angleRad - Math.PI/2)
		 	// console.log((360 / Math.PI) * angleRad)
    })


    app.renderer.view.addEventListener("click", function(event) {
        socket.emit("click", {

        });
    })
}











