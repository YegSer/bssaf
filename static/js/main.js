function start() {
    var game = new Game();
    
    game.connect(window.location.host + '/socket');
}