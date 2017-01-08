/**
 * Collects all data about player
 */
class Connection {
    /**
     * Creates new COnnection from network manager and socket
     * 
     * @param {NetworkManager} network Network manager
     * @param {socket} socket Socket of the player 
     */
    constructor (network, socket) {
        this.socket = socket;
        this.network = network;
        this.game = this.network.game;

        this.id = socket.id;
        this.username = null;
        this.loginned = false;

        this.socket.on('login', this.onLogin.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this))

        this.ship = null;
    }

    getEventInfo() {
        return {
            id: this.id,
            username: this.username,
            loginned: this.loginned
        }
    }

    /**
     * Callback for disconnecting
     */
    onDisconnect() {
        this.network.disconnected(this);
    }

    /**
     * Callback for login request.
     * Answers with 'loginned' event to client and true or false,
     * depending on succes of authentification
     * 
     * @param {string} username Username, play choised
     */
    onLogin(username) {
        logger.info(`${this.id} loginned with username ${username}`);

        this.username = username;
        this.loginned = true;

        this.socket.emit('loginned', true);
        this.game.loginned(this);
    }
}

module.exports = Connection;