var Crawler = require("simplecrawler");
var fs = require('fs');


var crawler = Crawler.crawl("http://en.wikipedia.org/wiki/910s_BC");

// crawler.interval = 10000;
crawler.maxConcurrency = 1;
crawler.maxDepth = 1;
crawler.discoverRegex=["li"]

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("It was a resource of type %s", response.headers['content-type']);
    body = responseBuffer.toString();
    // var re = new RegExp("^([a-z0-9]*)$");
    // // var re = /(li \d+(\.\d)*)/i;
    // var aaa=body.match(/^([a-z0-9]{5,})$/g)

var myString = 'aaa1zzz 81zzz 81ccc81zzz8aaa ttrtttrytrhunuybuu yu yu uy uytut';
var myRegexp = /<h2>.*?Events and trends.*?<\/h2>\n<ul>\n(?:<li(.*?)<\/li>\n)*<\/ul>/gim;
var regx = /aaa(1.*?8)*aaa/gmi;
var match =["aaa"];
var str="";
while (match !== null) {
	match = regx.exec(myString);
	if (match) {
		str =str + JSON.stringify(match);
		console.log(match)
		// console.log(match[1])
	}
	console.log('--------------------')
}

fs.writeFile("test", body, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

});
