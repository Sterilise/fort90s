const { Room, Client } = require("colyseus")


class Player {
  constructor(x, y) {
      // this.id = soc.id
      this.location = {x, y}
      this.speed = {x: 0, y: 0}
      this.rotation = 0
      this.dirty = false
      this.hp = 100
      this.armor = 100

      // var ground = world.getPhysics().createBody({
      //   type: 'static',
      //   position: Vec2(0, 0)
      // });

      // ground.createFixture({
      //   shape: planck.Circle(Vec2(0.0, 0.0), 5)
      // });

      // this.getSocket = () => soc
  }
}

class Bullet {
  constructor(id, x, y, rotation) {
    this.locationX = x
    this.locationY = y
    this.speedX = Math.cos(rotation - Math.PI/2)
    this.speedY = Math.sin(rotation - Math.PI/2)
    console.log(this.speedX, this.locationY)
    this.playerId = id
    this.rotation = rotation
    this.life = 40 // in ticks
  }
}

class BattleRoom extends Room {

  onInit (options) {
    console.log("battle room")
    this.setState({
      players: {},
      bullets: {}
    });
    this.setSimulationInterval(() => this.update());
  }

  onJoin (client) {
    this.state.players[ client.sessionId ] = new Player(75, 75);
  }

  onLeave (client) {
    delete this.state.players[ client.sessionId ];
  }

  update() {
    // console.log("Update")
    for(let key in this.state.players){
      let player = this.state.players[key]
      player.location.x += player.speed.x*10
      player.location.y += player.speed.y*10
      if(player.speed.x != 0){
        console.log(player.speed)
      }
    }
    let remove = [];
    let remove_player = [];

    for(let key in this.state.bullets) {
      let bullet = this.state.bullets[key]

      bullet.locationX += bullet.speedX*15
      bullet.locationY += bullet.speedY*15 

      bullet.life -= 1
      if(bullet.life == 0){
        remove.push(key);
        // this.state.bullets.shift()
      }

      for(let key in this.state.players){
        if(bullet.playerId == key){ continue }
        let player = this.state.players[key]
        let distance = Math.sqrt(Math.pow(player.location.x - bullet.locationX, 2) + Math.pow(player.location.y - bullet.locationY, 2))
        if(distance < 40){
          remove_player.push(key)
        }
      }

    }

    remove.forEach(item => {
      delete this.state.bullets[item]
    })

    remove_player.forEach(item => {
      delete this.state.players[item]
    })



  }

  onMessage (client, {data, action}) {
    let player = this.state.players[ client.sessionId ]

    console.log(action, data)
    switch(action) {
      case "player:speed": 
        player.speed = data.speed
        break;
      case "player:rotate":
        player.rotation = data.rotation
        break;
      case "player:fire":
        this.state.bullets["" + +(new Date())] = (new Bullet(client.sessionId, player.location.x, player.location.y, player.rotation))
        break;
      default:
        console.log("BAD") 
        break;
    }
  }
}

exports.default = BattleRoom