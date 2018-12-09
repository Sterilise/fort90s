const colyseus = require("colyseus");
const { monitor } = require("@colyseus/monitor")
const http = require("http");
const express = require("express");
// const WebSocket = require("uws")

const BattleRoom = require("./room1.js")

const app = express();

const gameServer = new colyseus.Server({
    // engine: WebSocket.Server,
    server: http.createServer(app)
});

app.use("/", express.static("../frontend"));
app.use('/colyseus', monitor(gameServer));

gameServer.register("battle", BattleRoom.default);
gameServer.listen(3000)
