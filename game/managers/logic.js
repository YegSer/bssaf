var p2 = require('p2');
var Ship = require('../entities/ship.js');

/**
 * Returns random integer in range [@{min}, @{max})
 * 
 * @param {number} min Minimal value, int could be
 * @param {number} max Maximal value, if undefined, than will be @{min}, and min will be 0
 */
function getRandomInt(min, max) {
    if (typeof(max) === 'undefined') {
        max = min;
        min = 0;
    }

    return Math.floor(Math.random() * (max - min)) + min;
}

class LogicManager {
    constructor (game) {
        this.game = game;
        this.world = new p2.World({
            gravity: [ 0, 0 ]
        });

        this.ships = [ ];
    }

    /**
     * Calls every tick
     * 
     * @param {number} dt Delta time in seconds
     */
    update (dt) {
        this.world.step(dt);
    }

    /**
     * Get info about world
     */
    getWorldInfo () {
        return {
            gravity: this.world.gravity
        }
    }

    /**
     * Method to generaate position for a new player
     * 
     * @return {Array<number>} 2 numbers: x and y of position
     */
    getNewPosition() {
        let x = getRandomInt(-10, 10),
            y = getRandomInt(-10, 10);

        return [ x, y ];
    }

    /**
     * Calls when player succesfully loginned
     * 
     * @param {Connection} connection Player connection
     */
    playerAdded (connection) {
        connection.ship = new Ship(this, connection);
        
        this.world.addBody(connection.ship.body);
        this.ships.push(connection.ship);

        this.game.network.shipSpawned(connection.ship);
    }
}

module.exports = LogicManager;