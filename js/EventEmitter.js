/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true */

function EventEmitter() {
}

EventEmitter.prototype = {
    "on": function (type, callback) {
        if (!(this.hasOwnProperty("listeners"))) {
            this.listeners = {};
        }

        if (typeof callback !== "function") {
            return this;
        }

        if (!this.listeners.hasOwnProperty(type)) {
            this.listeners[type] = [];
        }

        if (this.listeners[type].indexOf(callback) === -1) {
            this.listeners[type].push(callback);
        }
    },

    "off": function (type, callback) {
        var index;

        if (!callback) {
            delete this.listeners[type];
        } else {
            index = this.listeners[type].indexOf(callback);

            if (index !== -1) {
                this.listeners[type].splice(index, 1);
            }
        }

        return this;
    },

    "trigger": function (type, event) {
        var listeners = this.listeners[type];

        if (typeof event !== "object") {
            event = {
                "data": event
            };
        }

        event.type = type;

        if (listeners) {
            listeners.forEach(function (listener) {
                listener.call(this, event);
            }, this);
        }

        return this;
    }
};
