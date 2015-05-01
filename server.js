var Crawler = require("simplecrawler");
var fs = require('fs');


var crawler = Crawler.crawl("http://en.wikipedia.org/wiki/820s_BC");

// crawler.interval = 10000;
crawler.maxConcurrency = 1;
crawler.maxDepth = 1;
crawler.discoverRegex=["li"]

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
        console.log('.............')
        // console.log(match[0])
        // console.log(match[1])
        return match[1];
    };

    var getEventsFromBlock = function(eventsBlock) {
        var myRegexp = /(?:<h4>.*?<span.*?>(.*?)<\/span>.*?<\/h4>\n)?<ul>\n((?:<li.*?<\/li>\n)*)<\/ul>\n/gmi;
        var match = "";
        while (match !== null) {
            match = myRegexp.exec(eventsBlock);
            if (match) {
                if(match[1]) {
                    console.log("With title : ",match[1]);
                } 
                getEventsFromUl(match[2]);
                
            }
        }
    };

        var str ="";
    var getEventsFromUl = function(eventsBlock) {
        var myRegexp = /<li>(.*?)<\/li>/gmi;
        var match = "";
        while (match !== null) {
         match = myRegexp.exec(eventsBlock);
         if (match) {
             str =str + match[1] + '\n\n\n';
             console.log(match[1])
         }
         console.log('--------------------')
        }
    };
    var eventsBlock = getEventsBlock(body);
    getEventsFromBlock(eventsBlock);

// var myString = '1zzz 81zzz 81ccc81zzz8';

// var regx = /1(.*?)8/gmi;
// var match =["aaa"];
// var str="";
    
// while (match !== null) {
// 	match = regx.exec(myString);
// 	if (match) {
// 		str =str + JSON.stringify(match);
// 		console.log(match)
// 		// console.log(match[1])
// 	}
// 	console.log('--------------------')
// }

fs.writeFile("test", str, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});




});
