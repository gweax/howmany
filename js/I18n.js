I18n = {
    "defaultLanguage": "en",
    
    "translate": function (str, lang) {
        lang = lang || I18n.defaultLanguage;
        
        return I18n.locales[lang][str] || str;
    },
    
    "locales": {
        "de": {
            "How many": "Wie viele",
            "How many <span class=\"hm-title\"></span> can you think of in <span class=\"hm-minutes\"></span> minutes?": "Wie viele <span class=\"hm-title\"></span> fallen Dir in <span class=\"hm-minutes\"></span> Minuten ein?",
            "Focus the field below or click on the start button and type in as many items as you can think of. Valid items are added immediately, so there's no need of hitting enter. Don't bother with capital letters. However, do take care of spelling.": "Klick in das Feld oder auf den Start-Button und schreib so viele Elemente auf, wie Dir einfallen. Gültige Elemente werden automatisch erkannt, Du brauchst also nicht Return zu drücken. Kümmer Dich nicht um Groß- und Kleinschreibung, achte aber auf Rechtschreibung.",
            "Start Game": "Spiel starten",
            "Give up": "Aufgeben"
        }
    }
};
