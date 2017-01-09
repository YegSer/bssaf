var Connection = require('../entities/connection.js');

class NetworkManager {
    constructor (game) {
        this.game = game;

        this.io = game.io;
        this.connections = [ ];
    }

    /**
     * Calls every frame, sends world state to players
     * 
     * @param {number} dt Delta in seconds
     */
    update (dt) {
        let ships = [ ],
            connections = [ ];

        for (let i = 0; i < this.connections.length; ++i) {
            if (this.connections[i] && this.connections[i].ship) {
                connections.push(this.connections[i].getEventInfo());
                ships.push(this.connections[i].ship.getEventInfo());
            }
        }

        let event = {
            ships: ships,
            connections: connections
        };

        this.io.emit('update', event);
    }

    disconnected (connection) {
        logger.info(`Player ${connection.id} disconnected...`);

        let ind = this.connections.indexOf(connection);

        this.game.logic.removePlayer(connection);

        if (ind >= 0) {
            this.connections = this.connections.slice(ind, 1);
        }

        this.io.emit('user_left', connection.id);
    }

    shipSpawned(ship) {
        this.io.emit('ship_spawn', ship.getSpawnInfo());
    }

    onConnection (socket) {
        logger.info('New connection from %s.', socket.id);

        let connection = new Connection(this, socket);

        socket.emit('world_info', this.game.logic.getWorldInfo(socket.id));

        this.connections.push(connection);
    }
}

module.exports = NetworkManager;