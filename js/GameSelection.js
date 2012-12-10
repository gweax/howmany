/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true */
/*global window:false, EventEmitter:false, I18n:false */

function GameSelection() {
    window.addEventListener("hashchange", this.loadGame.bind(this), false);
    window.addEventListener("load", this.loadGame.bind(this), false);
}

GameSelection.prototype = Object.create(EventEmitter.prototype);

GameSelection.prototype.selectEntry = function (gameName) {
    var selector, selectedEntry;

    selectedEntry = document.querySelector(".selected");

    if (selectedEntry) {
        selectedEntry.classList.remove("selected");
    }

    selector = "[href='#" + gameName + "']";

    selectedEntry = document.querySelector("[data-lang=" + I18n.defaultLanguage + "] " + selector);

    if (!selectedEntry) {
        selectedEntry = document.querySelector(selector);
    }

    if (selectedEntry) {
        selectedEntry.classList.add("selected");
    }
};

GameSelection.prototype.loadGame = function (event) {
    var gameName, request, self;

    gameName = window.location.hash.substring(1);

    if (!gameName) {
        window.location.hash = "#us-states";
        return;
    }

    self = this;

    request = new XMLHttpRequest();
    request.open("GET", "games/" + gameName + ".js", false);
    request.onreadystatechange = function () {
        var game;

        if (request.readyState === 4 && request.status === 200) {
            game = JSON.parse(request.responseText);

            self.selectEntry(gameName);

            self.trigger("game", {
                "data": game
            });
        }
    };
    request.send(null);
};

