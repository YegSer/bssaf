var constants = require('../constants');
var FRAME_LENGTH = 1000.0 / constants.UPS;

var lastTick;

/**
 * Will be called every time we need to update world
 */
function update(delta) {
    console.log('Delta: ' + delta);
}

/**
 * The function calls every tick and when richs delta between frames
 * calls {@link update} function
 */
function loop() {
    var now = Date.now();
    var delta = now - lastTick;

    if (delta >= FRAME_LENGTH) {
        update(delta / 1000);
        
        lastTick = Date.now();
    }

    if (now + delta < FRAME_LENGTH) {
        setTimeout(loop);
    } else {
        setImmediate(loop);
    }
}

/**
 * Statrs game loop
 */
function startLoop() {
    lastTick = Date.now();

    setImmediate(loop);
}

/**
 * Handles connection from socket.io
 * 
 * @param {socket} socket Socket we get from socket.io 
 */
function onConnection(socket) {

}

module.exports.startLoop = startLoop;
module.exports.onConnection = onConnection;