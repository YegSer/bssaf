var p2 = require('p2');

class Ship {
    constructor (logic, connection) {
        this.logic = logic;
        this.connection = connection;
        this.shipType = 'default';

        this.body = new p2.Body({
            mass: 5,
            position: logic.getNewPosition()
        });
        this.shape = new p2.Circle({
            radius: 1
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
}

module.exports = Ship;
