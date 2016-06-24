import React from "react";


export default class Tweet extends React.Component {
  
  formatTweets(){
	 var divStyle = {
        display: "block",
        fontFamily: "arial",
        whiteSpace: "pre",
        margin: "1em 0",
        width: "10px"
	 };
  	//loop thru array of tweets ([html el, html el2, etc..])
  	//return element
  	var tempArray = [];
  	this.props.tweets.map(function(tweet){
  		var $tweet = $(tweet);
  		$tweet.find("img").each(function(){
  			var altValue = $(this).attr("alt");
  			$(this).before(altValue);
  			$(this).remove();
  		});
  		// //convert it to string
  		$tweet = $tweet.prop('outerHTML');
  		var temp = <div style={divStyle} dangerouslySetInnerHTML={{__html: $tweet}}></div>;
  		tempArray.push(temp);
  	});  	
  	return tempArray;
  }

  render() {
  	if(this.props.tweets.length > 1) {
  		console.log(this.props.tweets.length);
		var formattedTweets = this.formatTweets();  
	    return (
	      <div>{formattedTweets.map(function(tw){ return tw;})}</div>
	    );
  	}else{
  		return (<div>No Emojis...</div>);
  	}

  }
}
