/*! (c) Matthias Reuter | GPLv3 License | github.com/gweax/howmany */

/*jslint sloppy:true */
/*global GameStats:false, CountedList:false, Countdown:false, GameControl:false,
ItemList:false, GameSelection:false, GameStats:false, document:false */

(function () {

    var countdown, countedListFound, countedListMissing, gameControl, itemList,
        gameSelection, gameStats;
        
        
    gameStats = new GameStats();
        
        
    countedListFound = new CountedList(".hm-found");
    countedListMissing = new CountedList(".hm-missing");



    countdown = new Countdown(".hm-countdown");
    countdown.on("end", function (event) {
        var remaining;
    
        this.setLevel("error");
        
        remaining = itemList.getRemainingItems();
        remaining.forEach(function (item) {
            countedListMissing.addItem(item);
        });
        countedListMissing.setLevel("error");
        
        gameControl.stop();
        
        gameStats.set("timeLeft", 0);
        gameStats.set("state", "end");
        gameStats.set("missing", remaining);
        gameStats.set("found", itemList.found);
        gameStats.track();
    });
    countdown.on("tick", function (event) {
        if (event.data === 10) {
            this.setLevel("warning");
        }
    });
    
    

    gameControl = new GameControl(".hm-control");
    gameControl.on("start", function (event) {
        countdown.start();
    });
    gameControl.on("cancel", function (event) {
        var remaining;
        
        countdown.pause();
        countedListFound.setLevel("success");
        
        remaining = itemList.getRemainingItems();
        remaining.forEach(function (item) {
            countedListMissing.addItem(item);
            countedListMissing.setLevel("error");
        });
        countedListMissing.setLevel("error");
        
        gameStats.set("timeLeft", countdown.remaining);
        gameStats.set("state", "cancel");
        gameStats.set("missing", remaining);
        gameStats.set("found", itemList.found);
        gameStats.track();
    });
    gameControl.on("input", function (event) {
        itemList.tickOff(event.data.trim());
    });
    gameControl.on("restart", function (event) {
        countdown.reset();
        countedListFound.reset();
        countedListMissing.reset();
        itemList.reset();
        // don't reset gameControl

        countdown.start();
    });
    


    gameSelection = new GameSelection(".hm-selection");
    gameSelection.on("game", function (event) {
        var lang, game, minutesText;
        
        lang = I18n.defaultLanguage;
        
        if (!(event.data.hasOwnProperty(lang))) {
            lang = Object.keys(event.data)[0];
        }
        game = event.data[lang];
    
        countdown.reset();
        countedListFound.reset();
        countedListMissing.reset();
        gameControl.reset();
        gameStats.reset();
        // don't reset itemList
        
        countdown.setTime(game.minutes * 60);
        
        // REFACTOR: own component
        document.querySelector(".hm-title").innerHTML = game.title;

        minutesText = game.minutes + " " + I18n.translate(game.minutes === 1 ? "minute" : "minutes");
        document.querySelector(".hm-minutes").innerHTML = minutesText;
        document.querySelector(".hm-description").innerHTML = game.description;
    
        itemList = new ItemList(game.items);
        itemList.on("success", function (event) {
            countedListFound.addItem(event.item);
            gameControl.empty();
        });
        itemList.on("empty", function (event) {
            countdown.pause();
            countdown.setLevel("success");
            countedListFound.setLevel("success");
            gameControl.stop();
            
            gameStats.set("state", "finished");
            gameStats.set("timeLeft", countdown.remaining);
            gameStats.set("found", itemList.found);
            gameStats.set("missing", []);
            gameStats.track();
        });
        
        gameStats.set("name", game.name);
        gameStats.set("lang", lang);
    });
    
    
}());

