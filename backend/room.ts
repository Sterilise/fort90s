import { Room, Client } from "colyseus";

class Player {
    public location: Array<number>
    public speed: number[]
    public rotation: number
    public dirty: boolean
    public hp: number
    public armor: number

    constructor (public x: number,  public y: number ) {
        this.location[0] = x
        this.location[1] = y
        this.speed = [0, 0]
        this.rotation = 0
        this.dirty= false
        this.hp = 100
        this.armor = 0
    }


}

export class BattleRoom extends Room {

  onInit (options: any) {
    this.setState({
      players: {}
    });
  }

  onJoin (client) {
    this.state.players[ client.sessionId ] = new Player(50, 50);
    console.log(this.state)
  }

  onLeave (client) {
    delete this.state.players[ client.sessionId ];
  }

  onMessage (client, data) {
    if(data.action === "fire") {

    }

    if(data.action === "" ){

    }
  }
}
