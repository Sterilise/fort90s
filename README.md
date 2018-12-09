# fort90s
Fornit90s
**How it will work**
Every 0.1 seconds the server will emit a tick event.

Backend will be done in nodejs + socket.io + express
frontend will be done in normal javascript with socket.io library.

The clients will listen to the tick events and use the lobby object transmitted to 
render the screen.


## What is new
 - The backend uses colyseus for state synchonization, with msgpack. We don't use a physics engine as this will be an overkill for simple point to circle collision detecton. And we don't have any acceleration anyway. 
 Use `node app1.js` when in the backend to run the server.
 You will be able to access the game on http://localhost:3000.

Todo:
 - Place blocks
 - Have a better background map
 - Inventory for materials
 - Destroy environement