function GameSelection() {

    // TODO: refactor
    // I only need this as long as games are loaded synchronously
    if (GameSelection.singleton) {
        return GameSelection.singleton;
    }
    
    this.games = {};
    
    var self = this;

    window.addEventListener("hashchange", function (event) {
        var gameName = window.location.hash.substring(1);
        
        if (self.games.hasOwnProperty(gameName)) {
            self.trigger("game", {
                "data": self.games[gameName]
            });
        }
        
    }, false);
    
    window.addEventListener("load", function (event) {
    
        var gameName = window.location.hash.substring(1) || Object.keys(self.games)[0];
        
        if (gameName) {
            self.trigger("game", {
                "data": self.games[gameName]
            });
        }
    
    }, false);
    
    GameSelection.singleton = this;
}

GameSelection.prototype = Object.create(EventEmitter.prototype);

GameSelection.prototype.registerGame = function (name, data) {
    if (typeof name === "object") {
        data = {
            "en": name
        };
        name = name.name;
    }

    this.games[name] = data;    
};


// I was dumb
GameSelection.registerGame = function (name, data) {
    GameSelection.singleton.registerGame(name, data);
};
