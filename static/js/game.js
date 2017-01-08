class Game extends Phaser.Game {
    /** 
     * Creates new Game object
     * 
     * @param {number} w Canvas weight
     * @param {number} h Canvas height
     */
    constructor(w, h) {
        super(w, h, Phaser.AUTO, '');

        this.socket = null;
        this.username = Math.random().toString(36).substring(2, 5);
    }

    connected () {
        console.log('Succesfully connected');
        
        this.socket.emit('login', this.username);
    }

    loginned (res) {
        if (res) {
            console.log('Succesfully loginned');
        } else {
            console.log('Failed to login.')
        }
    }

    stop () {
        this.socket.disconnect();
    }

    disconnected () {
        console.log('Disconnected')
    }

    onWorldInfo (worldInfo) {
        console.log(worldInfo);
    }

    networkUpdate (update) {
        console.log(update);
    }

    connect (destination) {
        console.log(`Connecting to ${destination}...`)
        this.socket = io.connect(destination);
        
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('dsconnect', this.disconnected.bind(this));

        this.socket.on('loginned', this.loginned.bind(this));

        this.socket.on('world_info', this.onWorldInfo.bind(this));
        this.socket.on('update', this.networkUpdate.bind(this));
    }
}
