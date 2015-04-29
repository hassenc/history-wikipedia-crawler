var Crawler = require("simplecrawler");

var crawler = Crawler.crawl("http://en.wikipedia.org/wiki/814_BC");

// crawler.interval = 10000;
crawler.maxConcurrency = 1;
crawler.maxDepth = 1;

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    console.log("It was a resource of type %s", response.headers['content-type']);
    body = responseBuffer.toString();

    var aaa=body.match(/carthage/i);
    console.log(aaa)

    // Do something with the data in responseBuffer
});
