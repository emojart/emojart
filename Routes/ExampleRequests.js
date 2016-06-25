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
      $(window)(this).remove();
      deferred.resolve($tweetHTML);       
    });          
  });
  return deferred.promise;
};     

module.exports = {
  crawl: function(req, res){
    var URL = req.query.URL;
    var SELECTOR = req.query.CSS;
    var data = x(URL, SELECTOR , [{content: '@html', a: '@href', img: '@src'}])(function(err, tweetData) {

      var promises = [];
      
      for (var i = 0; i < tweetData.length; i++) {
        //var deferred = Q.defer();
        getAlt(tweetData[i]["content"]).then(function(item) {
          //deferred.resolve(item.text());
          promises.push(item.text());
          if(promises.length + 1 == tweetData.length){
            res.json(promises)
          }

        });
      }

      // Q.allSettled(promises).then(function(data){
      //   console.log(data.length);
      //   res.json(data);
      // });

    });
  }
}

