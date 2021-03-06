/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true */

function Levelable() {
    // mixin setLevel
    if (!(this instanceof Levelable)) {
        this.setLevel = Levelable.prototype.setLevel;
    }
}

Levelable.prototype = {
    "setLevel": function (level) {
        ["m-error", "m-warning", "m-info", "m-success"].forEach(function (l) {
            this.element.classList.remove(l);
        }, this);

        if (level) {
            this.element.classList.add("m-" + level);
        }
    }
};
