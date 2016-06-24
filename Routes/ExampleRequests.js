var fs = require('fs');
var path = require('path');
var Xray = require('x-ray');
var x = Xray();

module.exports = {
  crawl: function(req, res){
    var URL = req.query.URL;
    var SELECTOR = req.query.CSS;
    var data = x(URL, SELECTOR , [{content: '@html', a: '@href', img: '@src'}])(function(err, tweetData) {
      // console.log(typeof tweetData);  
      // console.log(tweetData);   
      var formattedData = [];
      for(index in tweetData){
        var tweetHTML = tweetData[index]["content"];
        // var firstPTag = tweetHTML.indexOf("<p");
        // var lastPTag = tweetHTML.indexOf("p>");
        formattedData.push(tweetHTML);
      }
      console.log(formattedData);
      //format the twitter data to... [html, html 1, html 3..]
      res.json(formattedData);
    })
  }
  // getComments: function(req, res){
  //   fs.readFile(COMMENTS_FILE, function(err, data) {
  //     if (err) {
  //       console.error(err);
  //       process.exit(1);
  //     }
  //     res.json(JSON.parse(data));
  //   });
  // },
  // postComments: function(req, res){
  //   fs.readFile(COMMENTS_FILE, function(err, data) {
  //     if (err) {
  //       console.error(err);
  //       process.exit(1);
  //     }
  //     var comments = JSON.parse(data);
  //     // NOTE: In a real implementation, we would likely rely on a database or
  //     // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
  //     // treat Date.now() as unique-enough for our purposes.
  //     var newComment = {
  //       id: Date.now(),
  //       author: req.body.author,
  //       text: req.body.text,
  //     };
  //     comments.push(newComment);
  //     fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
  //       if (err) {
  //         console.error(err);
  //         process.exit(1);
  //       }
  //       res.json(comments);
  //     });
  //   });
  // }
}

