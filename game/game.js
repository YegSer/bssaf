var constants = require('../constants');
    
function Game(io) {
    var self = this;

    this.FRAME_LENGTH = 1000.0 / constants.UPS;

    this.io = io.of('/socket');

    this.lastTick = null;
    this.connections = [ ];

    /**
     * Will be called every time we need to update world
     */
    this.update = function(delta) {
        self.io.emit('test');
    }

    /**
     * The function calls every tick and when richs delta between frames
     * calls {@link update} function
     */
    this.loop = function() {
        var now = Date.now();
        var delta = now - self.lastTick;

        if (delta >= self.FRAME_LENGTH) {
            self.update(delta / 1000);
            
            self.lastTick = Date.now();
        }

        // Why `self`?
        // Because JavaScrit, that's why!
        if (delta < self.FRAME_LENGTH) {
            setTimeout(self.loop); // Will be called in next tick of Node.JS loop
        } else {
            setImmediate(self.loop); // Will be calle immediate
        }
    }

    /**
     * Statrs game loop
     */
    this.startLoop = function() {
        self.lastTick = Date.now();

        setImmediate(self.loop);
    }

    /**
     * Handles connection from socket.io
     * 
     * @param {socket} socket Socket we get from socket.io 
     */
    this.onConnection = function(socket) {
        logger.info('New connection from %s.', socket.id);
        
        self.connections.push(socket);
    }
}

module.exports = Game;
