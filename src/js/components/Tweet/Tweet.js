import React from "react";


export default class Tweet extends React.Component {
  
  render() {
  	if(this.props.tweets.length > 1) {
  		console.log(this.props.tweets);
	    return (
	      <div>{this.props.tweets.map(function(tw, i){ console.log(tw); return (<pre key={i}>{tw}</pre>);})}</div>
	    );
  	}else{
  		return (<div>No Emojis...</div>);
  	}

  }
}
