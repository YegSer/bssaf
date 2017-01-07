class Connection {
    constructor (network, socket) {
        this.socket = socket;
        this.network = network;

        this.id = socket.id;
        this.username = null;

        this.socket.on('login', this.onLogin.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this))
    }

    onDisconnect() {
        this.network.disconnected(this);
    }

    onLogin(username) {
        logger.info(`${this.id} loginned with username ${username}`);

        this.socket.emit('loginned', true);
    }
}

module.exports = Connection;