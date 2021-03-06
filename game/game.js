var constants = require('../constants');
var NetworkManager = require('./managers/network.js');
var LogicManager = require('./managers/logic.js');
    
class Game {
    constructor(io) {
        this.FRAME_LENGTH = 1000.0 / constants.UPS;

        this.io = io.of('/socket');
        this.network = new NetworkManager(this);
        this.logic = new LogicManager(this);

        this.lastTick = null;
        this.onConnection = this.network.onConnection.bind(this.network);
    }

    loginned (connection) {
        this.logic.playerAdded(connection);
    }

    /**
     * Will be called every time we need to update world, network and etc
     * 
     * @param {number} dt Delta between updates in seconds 
     */
    update (dt) {
        this.logic.update(dt);
        this.network.update(dt);
    }

    /**
     * The function calls every tick and when richs delta between frames
     * calls {@link update} function
     */
    loop () {
        var now = Date.now();
        var delta = now - this.lastTick;

        if (delta >= this.FRAME_LENGTH) {
            this.update(delta / 1000);
            
            this.lastTick = Date.now();
        }

        // Why `this`?
        // Because JavaScrit, that's why!
        if (delta < this.FRAME_LENGTH) {
            setTimeout(this.loop.bind(this)); // Will be called in next tick of Node.JS loop
        } else {
            setImmediate(this.loop.bind(this)); // Will be calle immediate
        }
    }

    /**
     * Starts game loop
     */
    startLoop () {
        this.lastTick = Date.now();

        setImmediate(this.loop.bind(this));
    }
}

module.exports = Game;
