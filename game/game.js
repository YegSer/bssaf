var constants = require('../constants');
var FRAME_LENGTH = 1000.0 / constants.UPS;

var lastTick;

function update(delta) {
    console.log('Delta: ' + delta);
}

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

function startLoop() {
    lastTick = Date.now();

    setImmediate(loop);
}

function onConnection(socket) {

}

module.exports.startLoop = startLoop;
module.exports.onConnection = onConnection;