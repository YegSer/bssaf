var game = new Game();

function start() {
    game.connect(window.location.host + '/socket');
}

function stop() {
    game.stop();
}