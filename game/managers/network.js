var Connection = require('../entities/connection.js');

class NetworkManager {
    constructor (game) {
        this.game = game;

        this.io = game.io;
        this.connections = [ ];
    }

    disconnected (connection) {
        let ind = this.connections.indexOf(connection);

        if (ind >= 0) {
            this.connections.slice(ind, 1);
        }

        // TODO: Emmit this event to everyone
        //this.io.emmit('left', connection.id);
    }

    onConnection (socket) {
        logger.info('New connection from %s.', socket.id);

        let connection = new Connection(this, socket);
        this.connections.push(connection);
    }
}

module.exports = NetworkManager;