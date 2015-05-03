var Crawler = require("simplecrawler");
var fs = require('fs');
var natural = require('natural');






contextClassifier = new natural.BayesClassifier();
contextClassifier.addDocument("war battle fight defeat", 'War/Battle');
contextClassifier.addDocument("founded founding", 'Foundation');
contextClassifier.addDocument("born birth", 'Birth');
contextClassifier.addDocument("expanded conquer conquered", 'Conquest');
contextClassifier.addDocument("fall falls", 'Fall');
contextClassifier.train();

civilisationClassifier = new natural.BayesClassifier();
civilisationClassifier.addDocument("carthage Hannibal Carthagian", 'Carthage');
civilisationClassifier.addDocument("Rome Roman", 'Rome');
civilisationClassifier.addDocument("Persian Persia", 'Persia');
civilisationClassifier.addDocument("Greek Greece", 'Greeks');
civilisationClassifier.train();


var wikipediaLink = "http://en.wikipedia.org/wiki/";
var crawler = Crawler.crawl("http://en.wikipedia.org/wiki/147_BC");
// var crawler = new Crawler("en.wikipedia.org/wiki");

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
crawler.discoverResources = function(buf, queueItem) {
    var resources = [];
    for (var i = 146; i < 147; i++) {
        resources.push("http://en.wikipedia.org/wiki/146_BC","http://en.wikipedia.org/wiki/"+i+"_BC");
    };
    return resources;
};
crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("It was a resource of type %s", response.headers['content-type']);
    body = responseBuffer.toString();

    var getEventsBlock = function(myString) {
        // var myRegexp = /<h2>.*?Events.*?<\/h2>(?:.|\s)*?895 BC: Death of /gim;
        var myRegexp = /<h2>.*?Events.*?<\/h2>\n(?:.|\s)*?(?:<h3>.*?By place.*?<\/h3>\n)?((?:(?:<h4>.*?<\/h4>\n)?<ul>\n(?:<li.*?<\/li>\n)*<\/ul>\n)+)/gim;

        // var myRegexp = /<h2>.*?Events.*?<\/h2>\n(?:(?:.|\s)*?)?((?:<h3>.*?By place.*?|(?:.|\s)*?BC(?:.|\s)*?<\/h3>\n)?(?:(?:<h4>.*?<\/h4>\n)?<ul>\n(?:<li.*?<\/li>\n)*<\/ul>\n)*)/gim;
        // var myRegexp = /<h2>.*?Events.*?<\/h2>(?:.|\s)*?<h3(?:.|\s)*?BC(?:.|\s)*?<\/h3>/gim;
        var match = myRegexp.exec(myString);
        // console.log(match[2])
        // console.log('.............')
        // console.log(match[0])
        // console.log(match[1])
        return match[1];
    };

    var getEventsFromBlock = function(eventsBlock) {
        var myRegexp = /(?:<h4>.*?<span.*?>(.*?)<\/span>.*?<\/h4>\n)?<ul>\n((?:<li.*?<\/li>\n)*)<\/ul>\n/gmi;
        var match = "";
        var i =0;
        while (match !== null && i<100) {
            console.log(i)
            i++;
            match = myRegexp.exec(eventsBlock);
            if (match) {
                if(match[1]) {
                    // console.log("With title : ",match[1]);
                }
                
                // console. log('classification:' + contextClassifier.classify(match[1] +' '+ getEventsFromUl(match[2])));
                // console. log('civilisation:' + civilisationClassifier.classify(match[1] +' '+ getEventsFromUl(match[2])));
                // console.log(getEventsFromUl(match[2]));

                // console.log('--------------------')
                var eventObj = {
                    context : contextClassifier.classify(match[1] +' '+ getEventsFromUl(match[2])),
                    civilisation : civilisationClassifier.classify(match[1] +' '+ getEventsFromUl(match[2])),
                    body: match[2]
                };
                events.push(eventObj);
            }
        }
    };

    var getEventsFromUl = function(eventsBlock) {
        var myRegexp = /<li>(.*?)<\/li>/gmi;
        var match = "";
        while (match !== null) {
         match = myRegexp.exec(eventsBlock);
         if (match) {
             // str =str + match[1] + '\n\n\n';
         }
         return match[1];
        }
    };
    getEventsFromBlock(getEventsBlock(body));



});


