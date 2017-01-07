function Game() {
    var self = this; // Because callbacks change context
    this.socket = null;

    this.connected = function() {
        console.log('Succesfully connected');
        
        self.socket.on('test', function() {
            console.log('123');
        });
    }

    this.test = function(delta) {
        console.log(delta);
    }

    this.disconnected = function() {
        console.log('Disconnected')
    }

    this.connect = function(destination) {
        console.log(`Connecting to ${destination}...`)
        self.socket = io.connect(destination);
        
        self.socket.on('connect', self.connected);
        self.socket.on('dsconnect', self.disconnected);
    }
}
