/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true, plusplus:true */
/*global document:false, Levelable:false */

function CountedList(selector) {
    var element, counter, list, items, count;

    element = document.querySelector(selector);
    counter = element.querySelector(".counted-list_counter");
    list = element.querySelector(".counted-list_list");
    items = list.querySelectorAll("li");

    count = items.length;

    if (count > 0) {
        counter.textContent = count;
    }

    this.element = element;
    this.counter = counter;
    this.list = list;
    this.count = count;
}

CountedList.prototype = {
    "addItem": function (text) {
        var element = this.createItemElement(text);

        this.list.appendChild(element);
        this.count++;
        this.counter.textContent = this.count;
    },

    "createItemElement": function (text) {
        var element = document.createElement("li");
        element.className = "list-item list-item-flow";
        element.appendChild(document.createTextNode(text));

        return element;
    },

    "reset": function () {
        this.list.innerHTML = "";
        this.counter.innerHTML = "";
        this.count = 0;
        this.setLevel("");
    }
};

Levelable.call(CountedList.prototype);
