# fort90s
Fornit90s
**How it will work**
Every 0.1 seconds the server will emit a tick event.

Backend will be done in nodejs + socket.io + express
frontend will be done in normal javascript with socket.io library.

The clients will listen to the tick events and use the lobby object transmitted to 
render the screen.


Todo:
-Integrate physics engine
-and add all players when a player joins.