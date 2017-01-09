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

        for (let i = 0; i < this.ships.length; i++) {
            this.ships[i].update();
        }
    }

    /**
     * Get info about world
     * 
     * @param {string} socket_id Id of the player to identify
     */
    getWorldInfo (socket_id) {
        let ships = [ ];
        for (let i = 0; i < this.ships.length; ++i) {
            ships.push(this.ships[i].getSpawnInfo());
        }

        return {
            id: socket_id,
            gravity: this.world.gravity,
            ships: ships
        }
    }

    /**
     * Method to generaate position for a new player
     * 
     * @return {Array<number>} 2 numbers: x and y of position
     */
    getNewPosition() {
        let x = getRandomInt(300, 510),
            y = getRandomInt(300, 510);

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

    removePlayer (connection) {
        let ind = this.ships.indexOf(connection.ship);
        this.world.removeBody(connection.ship.body);

        if (ind >= 0) {
            this.ships = this.ships.slice(ind, 1);
        }
    }
}

module.exports = LogicManager;