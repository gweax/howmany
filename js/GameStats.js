/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true, regexp:true */
/*global EventEmitter:false, localStorage:false, navigator:false, XMLHttpRequest:false */

function GameStats() {
    this.reset();
}

GameStats.prototype = Object.create(EventEmitter.prototype);

GameStats.prototype.getCheck = function () {
    var c = localStorage.getItem("c");

    if (!c) {
        c = navigator.userAgent.toLowerCase().replace(/[^0-9a-f]/g, "") + String(Math.random()).substring(2);
        localStorage.setItem("c", c);
    }

    return c;
};

GameStats.prototype.set = function (key, value) {
    this.data[key] = value;
};

GameStats.prototype.reset = function () {
    this.data = {
        "check": this.getCheck()
    };
};

GameStats.prototype.track = function () {
    var request = new XMLHttpRequest();
    request.open("POST", "check.php", false);
    request.send(JSON.stringify(this.data));
};
