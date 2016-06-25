import React from "react";

import Tweet from "./Tweet/Tweet"

export default class TweetContainer extends React.Component {

	  
	//Call crawl API and get data
	//When data available send it as prop to Tweet component
	//tweetData = [html element, html element 2, ...]
	constructor(){
		super();
		this.state = {"tweetData": ["<p>hello</p>"]};
	}

	componentDidMount(){
		this.callCrawler();
	}

	callCrawler(){
		$.ajax({
		  url: "/api/crawl",
		  dataType: 'json',
		  cache: false,
		  type: 'get',
		  data: {URL: "https://twitter.com/emojistory", CSS: ".js-tweet-text-container"},
		  success: function(data) {
		  	// console.log("success");
		  	// console.log(data);
		    this.setState({"tweetData": data}); 
		  }.bind(this),
		  error: function(xhr, status, err) {
		  	console.log("error");
		    console.error(this.props.url, status, err.toString());
		  }.bind(this)
		});	
	}

	render() {
		return (
		  <div>
		  	<Tweet tweets={this.state.tweetData} />
		  </div>
		);
	}
}
