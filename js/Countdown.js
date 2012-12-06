/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true */
/*global document:false, EventEmitter:false, window:false, Levelable:false */

function Countdown(selector) {
    var element = document.querySelector(selector);

    this.element = element;
    this.running = false;

    this.setTime(element.innerText);
}

Countdown.prototype = Object.create(EventEmitter.prototype);

Countdown.prototype.start = function () {
    var secondsRun;

    if (this.running) {
        return;
    }

    secondsRun = this.seconds - this.remaining;
    this.startTime = Date.now() - secondsRun * 1000;

    this.running = true;
    this.timer = window.setTimeout(this.tick.bind(this), 100);
};

Countdown.prototype.pause = function () {
    window.clearTimeout(this.timer);
    this.running = false;
};

Countdown.prototype.reset = function () {
    this.setLevel("");
    this.pause();
    this.remaining = this.seconds;
    this.render();
};

Countdown.prototype.tick = function () {
    var now, ms, remaining;

    now = Date.now();

    ms = now - this.startTime;
    remaining = Math.max(0, this.seconds - Math.floor((now - this.startTime) / 1000));

    if (remaining < this.remaining) {
        this.remaining = remaining;
        this.render();
        this.trigger("tick", remaining);
    }

    if (remaining > 0) {
        this.timer = window.setTimeout(this.tick.bind(this), 100);
    } else {
        this.trigger("end");
    }

};

Countdown.prototype.render = function () {
    var minutes, seconds;

    minutes = Math.floor(this.remaining / 60);
    seconds = this.remaining % 60;

    this.element.innerHTML = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

Countdown.prototype.setTime = function (seconds) {
    var match;

    if (typeof seconds === "string") {
        match = seconds.match(/\d{1,2}/g);

        if (match) {
            seconds = match.reduce(function (p, v) {
                return p * 60 + Number(v);
            });
        }
    }

    seconds = seconds || 0;

    this.seconds = seconds;
    this.remaining = seconds;

    this.render();
};

Levelable.call(Countdown.prototype);
