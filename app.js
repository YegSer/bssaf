var app = require('express')();

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var serveStatic = require('serve-static');

var constants = require('./constants');

var Game = require('./game/game.js');
var Log = require('log');

global.logger = new Log('info');
game = new Game(io);

/**
 * Callback for server startup
 */
function listening() {
    logger.info(`Server running on ${constants.HTTP_PORT}...`);
}

app.use(serveStatic(__dirname + '/static'));
http.listen(constants.HTTP_PORT, listening);

// Setting up sockets
io.of('/socket').on('connection', game.onConnection);
game.startLoop();