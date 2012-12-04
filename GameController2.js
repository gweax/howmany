(function () {

    var countdown, countedListFound, countedListMissing, gameControl, itemList,
        gameSelection;
        
        
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
        });
    });
    
    
}());
