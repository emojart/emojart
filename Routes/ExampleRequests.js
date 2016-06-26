var fs = require('fs');
var path = require('path');
var Xray = require('x-ray');
var x = Xray();
var jsdom = require('jsdom');
var $ = require('jquery')
var Q = require("q");
var request = require("request");
var cheerio = require('cheerio');

var getAlt = function(tweetHTML) {
  var deferred = Q.defer();
  jsdom.env(tweetHTML, function (errors, window) {
    //console.log(errors);
    var $tweetHTML = $(window)(tweetHTML);
    $tweetHTML.find("img").each(function(){
      var altValue = $(window)(this).attr("alt");
      $(window)(this).before(altValue);
      // $(window)(this).remove();
      deferred.resolve($tweetHTML);
    });          
  });
  return deferred.promise;
};     

// var getTweets = function(url) {
//   request(url, function(error, response){
//       if(!error){
//         var body = JSON.parse(response.body);
//         var min_position = body.min_position;
//         var has_more_items = body.has_more_items;
//         var items_html = body.items_html;
//         var new_latent_count = body.new_latent_count;

//         var $ = cheerio.load(items_html);
//         $('.TweetTextSize').filter(function(){
//           var $tweetPost = $(this);
//           if ($tweetPost.html().indexOf("img") > -1) {
//             $tweetPost.find("img").each(function(){
//               var altValue = $(this).attr("alt");
//               $(this).before(altValue);
//             });
//             console.log($tweetPost.text());
//           };
//         })

//         if (has_more_items === true) {
//           var url = 'https://twitter.com/i/profiles/show/emojiart_/timeline' +
//                         '?include_available_features=1' +
//                         '&max_position=' + min_position +
//                         '&reset_error_state=false';
//           getTweets(url);
//         }

//       };
//   });
// };

// var getTweets = function(url, has_more_items, promises) {
//   if (has_more_items === true) {
//     // get and push tweets and then recall getTweets
//     getTweets(url, true, promises);
//   } else {
//     return promises;
//   }
// }

function getTweets(currentListOfTweets, user_name, min_position, has_more_items, res){
  if (has_more_items == false) {
    console.log('Total number of posts extracted from user', currentListOfTweets.length);
    res.json(currentListOfTweets);
  } else {
    
    var url = 'https://twitter.com/i/profiles/show/' +
                  user_name + '/timeline' +
                  '?include_available_features=1' +
                  '&max_position=' + min_position +
                  '&reset_error_state=false';

    request(url, function(error, response){

        if(!error){
          var body = JSON.parse(response.body);
          var min_position = body.min_position;
          var has_more_items = body.has_more_items;
          var items_html = body.items_html;
          var new_latent_count = body.new_latent_count;

          var $ = cheerio.load(items_html);
          $('.TweetTextSize').filter(function(){
            var $tweetPost = $(this);
            if ($tweetPost.html().indexOf("img") > -1) {
              $tweetPost.find("img").each(function(){
                var altValue = $(this).attr("alt");
                $(this).before(altValue);
              });
              console.log($tweetPost.text());
              currentListOfTweets.push($tweetPost.text());
            };
          });

          return getTweets(currentListOfTweets, user_name, min_position, has_more_items, res);
        };
    });
  }
}



//take initial call to twitter
//parse tweets and push to data array
//call function again
//return array when has_more_jtems = false

module.exports = {
  crawl: function(req, res){
    getTweets([], 'emojistory', '656490279860482048', true, res);
  }
}

// module.exports = {
//   crawl: function(req, res){
//     var URL = req.query.URL;
//     var SELECTOR = req.query.CSS;
//     var data = x(URL, SELECTOR , [{content: '@html', a: '@href', img: '@src'}])(function(err, tweetData) {

//       var promises = [];
//       for (tweetHTML in tweetData) {
//           if (tweetData[tweetHTML]["content"].indexOf("img") > -1) {
//             var promise = getAlt(tweetData[tweetHTML]["content"]).then(function(context){
//               console.log(context.text());
//               return context.text();
//             });
//             promises.push(promise);
//           };
//       };
//       Q.all(promises).then(function(results){
//         console.log(results.length);
//         res.json(results);
//       });
//     });
//   }
// }