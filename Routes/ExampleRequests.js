var fs = require('fs');
var path = require('path');
var Xray = require('x-ray');
var x = Xray();
var jsdom = require('jsdom');
var $ = require('jquery')
var Q = require("q");


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

module.exports = {
  crawl: function(req, res){
    var URL = 'https://twitter.com/i/profiles/show/emojiart_/timeline?include_available_features=1&include_entities=1&max_position=656490279860482048&reset_error_state=false';

    // https://twitter.com/i/profiles/show/emojiart_/timeline?include_available_features=1&include_entities=1&max_position=656490279860482048&reset_error_state=false
    // https://twitter.com/i/profiles/show/emojiart_/timeline?include_available_features=1&include_entities=1&max_position=370732064439816192&reset_error_state=false
    jsdom.env(URL, function (errors, window) {
      $(window).ajax({
        url: URL,
        dataType: 'json',
        cache: false,
        type: 'get',
        data: {URL: "https://twitter.com/emojiart_", CSS: ".js-tweet-text-container"},
        success: function(data) {
          console.log("success");
          console.log(data);
          
          //this.setState({"tweetData": data}); 
        }.bind(this),
        error: function(xhr, status, err) {
          console.log("error");
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      }); 
    });
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