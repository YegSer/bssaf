let w = window.innerWidth * window.devicePixelRatio,    
    h = window.innerHeight * window.devicePixelRatio;

var game;

function start() {
    game = new Game(w, h, window.location.host + '/socket');
}

window.onbeforeunload = function(event) {
    game.stop();
    return null;
};
