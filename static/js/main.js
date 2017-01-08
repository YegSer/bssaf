let w = window.innerWidth * window.devicePixelRatio,    
    h = window.innerHeight * window.devicePixelRatio;

var game = new Game(w, h);

function start() {
    game.connect(window.location.host + '/socket');
}

function stop() {
    game.stop();
}