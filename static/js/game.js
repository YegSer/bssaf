class Game {
    constructor() {
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

    connect (destination) {
        console.log(`Connecting to ${destination}...`)
        this.socket = io.connect(destination);
        
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('dsconnect', this.disconnected.bind(this));

        this.socket.on('loginned', this.loginned.bind(this));
    }
}
