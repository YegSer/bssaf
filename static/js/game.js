class Game extends Phaser.Game {
    /** 
     * Creates new Game object
     * 
     * @param {number} w Canvas weight
     * @param {number} h Canvas height
     */
    constructor(w, h, destination) {
        super(w, h, Phaser.AUTO, '');
        this.destination = destination;

        this.enableDebug = true;

        this.id = null;
        this.socket = null;
        this.username = Math.random().toString(36).substring(2, 5);

        this.state.add('default', {
            preload: this.preload.bind(this),
            create: this.phaserInit.bind(this),
            render: this.render.bind(this),
            update: this.logicUpdate.bind(this)
        }, true);

        this.ships = new Map();
        this.ship = null;
    }

    /** 
     * This function calls bedore any other function od phaser
     */
    preload() {
        this.load.image('ship_default', 'sprites/ships/default.png');
    }

    phaserInit() {
        console.log('Initing Phaser..');

        this.camera.atLimit = false;

        this.connect();
    }

    logicUpdate () {
        if (this.cursors) {
            this.socket.emit('input', {
                left: this.cursors.left.isDown,
                right: this.cursors.right.isDown,
                push: this.cursors.up.isDown
            });
        }
    }

    /**
     * Callback for connection to server
     */
    connected () {
        console.log('Succesfully connected');
        
        this.socket.emit('login', this.username);
    }

    /**
     * Callback for login result
     */
    loginned (res) {
        if (res) {
            console.log('Succesfully loginned');
        } else {
            console.log('Failed to login.')
        }
    }

    /**
     * Stops the game
     */
    stop () {
        this.socket.disconnect();
    }

    /**
     * Callback for disconnecting
     */
    disconnected () {
        console.log('Disconnected')
    }

    onWorldInfo (worldInfo) {
        console.log('Clearing ships...');
        this.ships.forEach((ship) => {
            ship.destroy();
        });

        console.log(`Got world info from server.`)

        let gx = worldInfo.gravity[0],
            gy = worldInfo.gravity[1];

        console.log(`Got id from server: ${worldInfo.id}.`);
        this.id = worldInfo.id;

        console.log(`Setting up gravity to (${gx}, ${gy})`);

        this.physics.startSystem(Phaser.Physics.P2JS);

        console.log(`Spawing ${worldInfo.ships.length} ships..`);

        for (let i = 0; i < worldInfo.ships.length; ++i) {
            this.onShipSpawn(worldInfo.ships[i]);
        }

        game.physics.p2.gravity.x = gx;
        game.physics.p2.gravity.y = gy;
    }

    onShipSpawn (shipInfo) {
        console.log(`Ship ${shipInfo.id} spawned.`)

        let ship = this.add.sprite(shipInfo.position[0], shipInfo.position[0], 'ship_default');

        console.log(shipInfo);
        ship.data = {
            id: shipInfo.id,
            username: shipInfo.username,
            shipType: shipInfo.shipType,
            speed: 1
        };
        
        this.physics.p2.enable(ship, this.enableDebug);
        this.ships.set(shipInfo.id, ship);
        
        if (shipInfo.id == this.id) {
            //this.camera.follow(ship);
            this.camera.position = new Phaser.Point(shipInfo.position[0], shipInfo.position[0]);

            this.ship = ship;
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        
        ship.body.setCircle(45);
    }

    onUserLeft (id) {
        if (this.ships.has(id)) {
            this.ships.get(id).destroy();
            this.ships.delete(id);
        }
    }

    /**
     * Calls on every update from network
     */
    networkUpdate (update) {
        for (let i = 0; i < update.ships.length; ++i) {
            let ship_info = update.ships[i];

            if (this.ships.has(ship_info.id)) {
                var local_ship = this.ships.get(ship_info.id);

                local_ship.body.data.angularVelocity = ship_info.angularVelocity * Math.PI / 180.0;
                local_ship.body.velocity = ship_info.velocity;

                local_ship.body.angle = ship_info.rotation;
                local_ship.body.x = ship_info.position[0];
                local_ship.body.y = ship_info.position[1];
            } else {
                console.log(`Undefined ship: ${ship_info.id}.`);
            }
        }
    }

    connect () {
        console.log(`Connecting to ${this.destination}...`)
        this.socket = io.connect(this.destination);
        
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('dsconnect', this.disconnected.bind(this));

        this.socket.on('loginned', this.loginned.bind(this));

        this.socket.on('world_info', this.onWorldInfo.bind(this));
        this.socket.on('ship_spawn', this.onShipSpawn.bind(this));
        this.socket.on('user_left', this.onUserLeft.bind(this));

        this.socket.on('update', this.networkUpdate.bind(this));
    }

    render() {
        //this.debug.cameraInfo(game.camera, 32, 32);
    }
}
