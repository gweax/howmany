function GameControl(selector) {
    var element, input, startButton, cancelButton;

    element = document.querySelector(selector);
    input = element.querySelector("input");
    startButton = element.querySelector(".game-control_button-start");
    cancelButton = element.querySelector(".game-control_button-cancel");
    
    startButton.addEventListener("click", this.start.bind(this), false);
    cancelButton.addEventListener("click", this.cancel.bind(this), false);

    input.addEventListener("focus", this.start.bind(this), false);
    input.addEventListener("input", this.propagate.bind(this), false);
    input.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
            event.preventDefault();
        }
    }, false);
    
    this.element = input; // for levelization
    this.startButton = startButton;
    this.cancelButton = cancelButton;
}

GameControl.prototype = Object.create(EventEmitter.prototype);

GameControl.prototype.setRunning = function (running) {
    this.running = running;
    this.startButton.disabled = running;
    this.cancelButton.disabled = !running;
};

GameControl.prototype.start = function (event) {
    if (this.running) {
        return;
    }
    
    if (event.target === this.element && this.stopped) {
        // allow restart by clicking on button only
        return;
    }
    
    this.setRunning(true);
    
    if (event.target === this.startButton) {
        this.element.focus();
    }
    
    if (this.stopped) {
        this.trigger("restart");
    } else {
        this.trigger("start");
    }
};

GameControl.prototype.cancel = function () {
    if (!this.running) {
        return;
    }
    
    this.setRunning(false);
    this.stopped = true;

    this.startButton.innerHTML = I18n.translate("Try again");
    
    this.trigger("cancel");
};

GameControl.prototype.stop = function (event) {
    this.setRunning(false);
    this.stopped = true;

    this.element.blur();
    this.startButton.innerHTML = I18n.translate("Try again");
    
    this.trigger("stop");
};

GameControl.prototype.reset = function () {
    this.empty();
    this.element.blur();
    this.setRunning(false);
    delete this.stopped;
    this.startButton.innerHTML = I18n.translate("Start Game");
};

GameControl.prototype.empty = function () {
    this.element.value = "";
};

GameControl.prototype.propagate = function (event) {
    if (this.running) {
        this.trigger("input", event.target.value);
    }
};

Levelable.call(GameControl.prototype);

