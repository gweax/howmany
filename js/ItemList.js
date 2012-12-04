function ItemList(items) {
    this.data = items;
    
    this.reset();
}

ItemList.prototype = Object.create(EventEmitter.prototype);

ItemList.prototype.addItem = function (variation, index, items) {
    this.items[variation.toLowerCase()] = items;
};

ItemList.prototype.removeItem = function (item) {
    delete this.items[item.toLowerCase()];
};
    
ItemList.prototype.getRemainingItems = function () {
    var items;
    
    items = this.data.map(function (item) {
        return item.split("|")[0];
    }).filter(function (item) {
        return this.items.hasOwnProperty(item.toLowerCase());
    }, this);
    
    return items;
};

ItemList.prototype.tickOff = function (item) {
    var key, variations, containsItem, event;
    
    key = item.toLowerCase();
    containsItem = this.items.hasOwnProperty(key);

    if (containsItem) {
        variations = this.items[key];
        variations.forEach(this.removeItem, this);
        
        this.remaining++;
        
        // get Original spelling
        item = variations[0];
        
        event = {
            "item": item,
            "total": this.total,
            "found": this.remaining
        };
        
        this.found.push(item);
        
        this.trigger("success", event);
        
        if (Object.keys(this.items).length === 0) {
            this.trigger("empty");
        }
    } else {
        this.trigger("failure", event);
    }

    return containsItem;
};

ItemList.prototype.reset = function () {
    var items = this.data;

    this.items = {};
    this.found = [];
    this.total = items.length;
    this.remaining = 0;
    
    items.forEach(function (item) {
        var variations = item.split("|");
        variations.forEach(this.addItem, this);
    }, this);
};
