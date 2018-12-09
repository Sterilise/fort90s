var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (location.port ? ':'+location.port : ''));


// let client = new Colyseus.Client("ws://localhost:3000");
let room = client.join("battle");



let app = new PIXI.Application({ 
    width: window.innerWidth, 
    height: window.innerHeight,                       
    antialias: false, 
    transparent: true, 
    resolution: 1
  }
);

//makes the canvas fill the whole screen.
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

var viewport = new PIXI.extras.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 5000,
    worldHeight: 5000,

    interaction: app.renderer.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
});



app.stage.addChild(viewport);

viewport
    // .drag()
    // .pinch()
    .wheel()
    // .bounce()
    .clamp({ left: true, right: true, top: true, bottom: true, direction: "all"})
    // .decelerate();

var graphics = new PIXI.Graphics();

graphics.beginFill(0xFFFFFF);
graphics.lineStyle(4, 0x000000, 1);

// draw a shape
graphics.moveTo(0,0);
graphics.lineTo(5000, 0);
graphics.lineTo(5000, 5000);
graphics.lineTo(0, 5000);
graphics.lineTo(0, 0);

graphics.endFill();

graphics.beginFill(0x77cc77);
graphics.lineStyle(4, 0x000000, 1);

// draw a shape
graphics.moveTo(500, 500);
graphics.lineTo(4500, 500);
graphics.lineTo(4500, 4500);
graphics.lineTo(500, 4500);
graphics.lineTo(500, 500);

graphics.endFill();

viewport.addChild(graphics)



let sprites = {}
let bullets = {}
//load an image and run the `setup` function when it's done
PIXI.loader
  .add("assets/textures/player.png")
  .add('assets/textures/Moving.json')
  .add('assets/textures/bullet.png')
  .load(setup);


function setup() {

    // console.log(PIXI.loader.resources["assets/textures/Moving.json"].spritesheet)
    

    // viewport.addChild(animated)
    
    let keys = {x: 0, y: 0}
    function speedUpdate(x, y) {
        room.send({ action: "player:speed", data: { speed: keys } })
    }

    let pressed = {}
    function detectKey(key, call) {
        return function(pressed_key) {
            if(key == pressed_key && pressed[key] !== true) {
                call() 
                speedUpdate()
                pressed[key] = true
            }
        }
    }

    function releaseKey(key, call) {
        return function(pressed_key) {
            if(key == pressed_key && pressed[key] !== false){
                call() 
                speedUpdate()
                pressed[key] = false
            }
        }
    }

    function rotate(angle) {
        room.send({ action: "player:rotate", data: { rotation: angle }})
    }

	document.addEventListener("keydown", function(event){
        let key = event.which //the key number
        detectKey(87, () => keys.y = -1)(key)
        detectKey(83, () => keys.y = 1)(key)
        detectKey(65, () => keys.x = -1)(key)
        detectKey(68, () => keys.x = 1)(key)
     })
    
    document.addEventListener("keyup", function(event){
        let key = event.which //the key number
        releaseKey(87, () => keys.y = 0)(key)
        releaseKey(83, () => keys.y = 0)(key)
        releaseKey(65, () => keys.x = 0)(key)
        releaseKey(68, () => keys.x = 0)(key)
    })

    function updatePlayerSprite(sprite, player) {
		sprite.x = player.location.x
		sprite.y = player.location.y
        sprite.rotation = player.rotation;
        
        if(player.speed.x != 0 || player.speed.y != 0){
            sprite.play()
        }

        if(player.speed.x == 0 && player.speed.y == 0){
            sprite.gotoAndStop(0)
        }

        if(sprite.name === room.sessionId) {
            viewport.moveCenter(player.location.x, player.location.y)
        }

	}


	// function createPlayerSprite(key) {
	// 	let playerSprite = new PIXI.Sprite(PIXI.loader.resources["assets/textures/player.png"].texture);
	// 	playerSprite.name = key
	// 	playerSprite.anchor.x = 0.5
	// 	playerSprite.anchor.y = 0.5
	// 	return playerSprite
    // }

    function createBulletSprite() {
        let sprite = new PIXI.Sprite(PIXI.loader.resources["assets/textures/bullet.png"].texture)

        // playerSprite.play()
		sprite.anchor.x = 0.5
        sprite.anchor.y = 0.5
        sprite.scale.x = 0.7
        sprite.scale.y = 0.7
		return sprite
    }

    function createPlayerSprite(key) {
        let playerSprite = new PIXI.extras.AnimatedSprite(Object.values(PIXI.loader.resources["assets/textures/Moving.json"].spritesheet.textures))
        playerSprite.animationSpeed = 0.2

        // playerSprite.play()
        playerSprite.name = key
		playerSprite.anchor.x = 0.5
        playerSprite.anchor.y = 0.5
        playerSprite.scale.x = 1.5
        playerSprite.scale.y = 1.5
		return playerSprite
    }
   
    for(let key in room.state.players){
        let player = room.state.players[key]
        let sprite = createPlayerSprite(key)
        sprites[key] = sprite
        updatePlayerSprite(sprite, player)
        viewport.addChild(sprite)
    }


    
    room.listen("players/:id", change => {
        let key = change.path.id
        let player = room.state.players[key]
        console.log("id: ", change)

        if(change.operation === "remove") {
            viewport.removeChild(sprites[key])
            delete sprites[key]
            return
        }

        if(sprites[key] == null){
            let sprite = createPlayerSprite(key)

            sprites[key] = sprite
            viewport.addChild(sprite)

            updatePlayerSprite(sprite, player)
        }else{
            updatePlayerSprite(sprites[key], player)
        }
    })  

    room.listen("players/:id/:attribute", change => {
        console.log(change)
        let key = change.path.id
        let player = room.state.players[key]
        updatePlayerSprite(sprites[key], player)
    })  


    room.listen("players/:id/:attribute/:sub", change => {
        console.log(change)
        let key = change.path.id
        let player = room.state.players[key]
        updatePlayerSprite(sprites[key], player)
    })  

    room.listen("bullets/:id", change => {
        console.log(change)
        if(change.operation === "remove") {
            viewport.removeChild(bullets[change.path.id])
            delete bullets[change.path.id]
        }else{
            let sprite = createBulletSprite()
            // let player = room.state.players[room.sessionId]
        
            sprite.x = change.value.locationX 
            sprite.y = change.value.locationY
            sprite.rotation = change.value.rotation
            viewport.addChild(sprite) 
            bullets[change.path.id] = (sprite)
        }
    })

    room.listen("bullets/:id/:attribute", change => {
        console.log("bullet move", change)
        let sprite = bullets[change.path.id]
        let bullet = room.state.bullets[change.path.id]
        sprite.x = bullet.locationX
        sprite.y = bullet.locationY
        sprite.rotation = bullet.rotation
    })

    

    app.renderer.view.addEventListener("mousemove", function(event) {
        let player = room.state.players[room.sessionId]
        let sprite = sprites[room.sessionId] 
        let mouse = viewport.toWorld(event.clientX, event.clientY)

        let angleRad = Math.atan2(player.location.x -  mouse.x, player.location.y - mouse.y);

        sprite.rotation = -angleRad;
        rotate(-angleRad)
         // console.log((360 / Math.PI) * angleRad)
    })

    app.renderer.view.addEventListener("click", function(event) {
        room.send({ action: "player:fire", data: null })
    })

}
// room.send({ action: "player:speed", data: { speed: [1, 1] } })


// room.send({ action: "player:rotate", data: { rotation: Math.PI/2 }})