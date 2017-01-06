var app = require('express')();

var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var serveStatic = require('serve-static');

var constants = require('./constants');
var game = require('./game/game.js')

function listening() {
    console.log(`Server running on ${constants.HTTP_PORT}...`);
}

app.use(serveStatic(__dirname + '/static'));

io.of('/socket').on('connection', function(socket) {
    console.log('123');
});

http.listen(constants.HTTP_PORT, listening);

game.startLoop();