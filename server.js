var Crawler = require("simplecrawler");
var fs = require('fs');
var natural = require('natural');






contextClassifier = new natural.BayesClassifier();
contextClassifier.addDocument("war battle fight defeat", 'War/Battle');
contextClassifier.addDocument("founded founding", 'Foundation');
contextClassifier.addDocument("born birth", 'Birth');
contextClassifier.addDocument("expanded conquer conquered take", 'Conquest');
contextClassifier.addDocument("fall falls", 'Fall');
contextClassifier.train();

civilisationClassifier = new natural.BayesClassifier();
civilisationClassifier.addDocument("carthage Hannibal Carthagian", 'Carthage');
civilisationClassifier.addDocument("Rome Roman republic", 'Rome');
civilisationClassifier.addDocument("Persian Persia", 'Persia');
civilisationClassifier.addDocument("Greek Greece", 'Greeks');
civilisationClassifier.train();

var getClassificationArray =function(classifier,observation) {
    var classifications = classifier.getClassifications(observation);
    if (classifications.length >= 3 && classifications[0].value == classifications[1].value && classifications[1].value == classifications[2].value) {
        return [];
    } else if (classifications.length >= 2 && classifications[0].value == classifications[1].value) {
        return [classifications[0].label,classifications[1].label];
    } else {
        return [classifier.classify(observation)];
    }
}

// console.log(getClassificationArray(civilisationClassifier,"<li><a href=\"/wiki/Scipio_Aemilianus\" title=\"Scipio Aemilianus\">Scipio Aemilianus</a> takes command in the <a href=\"/wiki/Battle_of_Carthage_(c.149_BC)\" title=\"Battle of Carthage (c.149 BC)\" class=\"mw-redirect\">Battle of Carthage</a>. He built a mole across the gulf into the harbour, the <a href=\"/wiki/Carthaginians\" title=\"Carthaginians\" class=\"mw-redirect\">Carthaginians</a> dug a canal from their inner harbour basin to the coast and put to sea with a full fleet, but they are defeated in a naval engagement.</li>\n<li><a href=\"/wiki/Carthage\" title=\"Carthage\">Carthage</a> recalled from <a href=\"/wiki/Exile\" title=\"Exile\">exile</a> an able general, named <a href=\"/wiki/Hasdrubal_the_Boeotarch\" title=\"Hasdrubal the Boeotarch\" class=\"mw-redirect\">Hasdrubal</a>, who organized their solid defences. Against the 45-foot (13.7 m) city walls, the <a href=\"/wiki/Roman_Republic\" title=\"Roman Republic\">Romans</a> made slow progress.</li>\n<li>In <a href=\"/wiki/Lusitania\" title=\"Lusitania\">Lusitania</a>, <a href=\"/wiki/Hispania\" title=\"Hispania\">Hispania</a>, the <a href=\"/wiki/Celts\" title=\"Celts\">Celtic</a> king <a href=\"/wiki/Viriathus\" title=\"Viriathus\" class=\"mw-redirect\">Viriathus</a>, rallies Lusitanian resistance to <a href=\"/wiki/Rome\" title=\"Rome\">Rome</a>.</li>\n"
// ))

var raw = JSON.stringify(civilisationClassifier);
fs.writeFile("classifier.json", raw, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
    
var wikipediaLink = "http://en.wikipedia.org/wiki/";
var crawler = Crawler.crawl("http://en.wikipedia.org/wiki/800_BC");

// crawler.initialPath = "/147_BC";
// crawler.initialPort = 8080;
// crawler.initialProtocol = "http";
// crawler.interval = 5000;
// crawler.maxConcurrency = 2;
// crawler.maxDepth = 0;
// crawler.queue.add("http://en.wikipedia.org/wiki/146_BC")
var events =[];

crawler.on("complete", function() {
    console.log("complete");
    // console.log(events)
    fs.writeFile("test.json", JSON.stringify(events), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});
crawler.on("fetchstart", function (queueItem , requestOptions ) {
    
    console.log(queueItem.url);
});

crawler.on("fetcherror", function (queueItem , requestOptions ) {
    
    console.log("errrrrrrorrrrrr");
});

crawler.on("fetchclienterror", function (queueItem , requestOptions ) {
    
    console.log("errrrrrrorrrrrr");
});
crawler.discoverResources = function(buf, queueItem) {
    var resources = [];
    var blacklist =[452]
    for (var i = 801; i < 802; i++) {
        if (blacklist.indexOf(i)<0) {
            resources.push("http://en.wikipedia.org/wiki/"+i+"_BC");
        }
    };
    return resources;
};
crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("It was a resource of type %s", response.headers['content-type']);
    body = responseBuffer.toString();

    var getEventsBlock = function(myString) {
        console.log("bagin for ",queueItem.url)

        // var myRegexp = /<h2>.*?Events.*?<\/h2>(?:.|\s)*?895 BC: Death of /gim;
        var myRegexp = /<h2>.*?Events.*?<\/h2>\n(?:.|\s)*?(?:<h3>.*?By place.*?<\/h3>\n)?((?:(?:<h4>.*?<\/h4>\n)?<ul>\n(?:<li.*?<\/li>\n)*<\/ul>\n)+)/gim;
        var match = myRegexp.exec(myString);
        if (match) {
            // console.log("return block for ",queueItem.url)
            // console.log(match[1])
            return match[1];
        } else {
            console.log("return none for ",queueItem.url)
            return "";
        }
        // console.log("--------------",queueItem.url)
        // console.log("--------------",match[1])
        
    };

    var getEventsFromBlock = function(eventsBlock) {
        var myRegexp = /(?:<h4>.*?<span.*?>(.*?)<\/span>.*?<\/h4>\n)?<ul>\n((?:<li.*?<\/li>\n)*)<\/ul>\n/gmi;
        var match = "";
        var i = 0;

        var date ; 
        bcYearRegExp = /[0-9]{1,4}_BC|[0-9]{1,4} BC|[0-9]{1,4}/i
        titleRegExp = /<h1(?:.*?)firstHeading(.*?)h1>/ig;
        var title = titleRegExp.exec(responseBuffer.toString());
        urlDate = bcYearRegExp.exec(queueItem.url)[0];
        titleDate = bcYearRegExp.exec(title[1])[0];
        while (match !== null && i<100) {
            i++;
            match = myRegexp.exec(eventsBlock);
            if (match) {
            // console.log("*****************",queueItem.url)
            // console.log(queueItem)
                if(match[1]) {
                    // console.log("With title : ",match[1]);
                }
                if(match[2]) {
                // console.log(i)
                    
                    var eventformUl = getEventsFromUl(match[2]);
                    for (var j = 0; j < eventformUl.length; j++) {
                        if (urlDate && titleDate && titleDate == urlDate.replace('_',' ')) {
                            date = titleDate;
                        } else {
                            date = bcYearRegExp.exec(match[1] +' '+ eventformUl[j]);
                        }
                        // console.log(j)
                        var eventObj = {
                        date : date,
                        context : getClassificationArray(contextClassifier,match[1] +' '+ eventformUl[j]),
                        civilisation : getClassificationArray(civilisationClassifier,match[1] +' '+ eventformUl[j]),
                        body: eventformUl[j]
                        };
                        events.push(eventObj);
                    };
                }
            }
        }
    };

    var getEventsFromUl = function(eventsBlock) {
        var myRegexp = /<li>(.*?)<\/li>/gmi;
        var match = "";
        var events = []
        while (match !== null) {
         match = myRegexp.exec(eventsBlock);
         if (match) {
            events.push(match[1])
         }
        }
        return events;
    };
    getEventsFromBlock(getEventsBlock(body));



});


