var app = require('express')();

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var serveStatic = require('serve-static');

var constants = require('./constants');
var game = require('./game/game.js')

/**
 * Callback for server startup
 */
function listening() {
    console.log(`Server running on ${constants.HTTP_PORT}...`);
}

app.use(serveStatic(__dirname + '/static'));
http.listen(constants.HTTP_PORT, listening);


io.of('/socket').on('connection', game.onConnection);
game.startLoop();