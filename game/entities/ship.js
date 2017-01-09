var p2 = require('p2');

class Ship {
    constructor (logic, connection) {
        this.logic = logic;
        this.connection = connection;
        this.shipType = 'default';

        this.speed = 300;
        this.rotationSpeed = 180;

        this.input = {
            left: false,
            right: false,
            push: false
        };

        this.body = new p2.Body({
            mass: 5,
            position: logic.getNewPosition()
        });
        this.shape = new p2.Circle({
            radius: 45
        });
        this.body.addShape(this.shape);
    }

    /**
     * Gets info about spawn for event
     */
    getSpawnInfo() {
        return {
            id: this.connection.id,
            username: this.connection.username,
            shipType: this.shipType,

            position: this.body.position,
            rotation: this.body.angle,

            speed: this.speed,
            rotationSpeed: this.rotationSpeed,

            mass: this.body.mass
        }
    }

    /**
     * Returns current state of ship
     */
    getEventInfo() {
        return {
            id: this.connection.id,
            username: this.connection.username,

            position: this.body.position,
            rotation: this.body.angle,

            velocity: this.body.velocity,
            angularVelocity: this.body.angularVelocity
        }
    }

    update(dt) {
        if (this.input.left && !this.input.right) {
            this.body.angularVelocity = -this.rotationSpeed;
        } else if (this.input.right && !this.input.left) {
            this.body.angularVelocity = this.rotationSpeed;
        } else {
            this.body.angularVelocity = 0;
        }

        if (this.input.push) {
            let angle = Math.PI * this.body.angle / 180.0 - Math.PI / 2;
            
            this.body.force[0] += Math.cos(angle) * this.speed;
            this.body.force[1] += Math.sin(angle) * this.speed;
        }
    }

    onInput (input) {
        this.input = input;
    }
}

module.exports = Ship;
