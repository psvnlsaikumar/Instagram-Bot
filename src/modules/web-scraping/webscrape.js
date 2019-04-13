const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");

var scrape = function(target, query) {
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(target);
    const images = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a.fileThumb")).map(
        data => data.href
      )
    );

    console.log(images);
    await browser.close();

    //Saving starts from here
    var download = function(uri, filename, callback) {
      request.head(uri, function(err, res, body) {
        console.log("content-type:", res.headers["content-type"]);
        console.log("content-length:", res.headers["content-length"]);

        request(uri)
          .pipe(fs.createWriteStream(filename))
          .on("close", callback);
      });
    };

    var temp = 1;
    images.forEach(function(url) {
      var ext = url.split(".");
      var fileName = "res/images/" + temp;

      //Dwonload happens here
      download(url, fileName, function() {
        console.log("Successfully downloaded " + fileName);
      });
      temp++;
    });
  })();
};

module.exports = scrape;
