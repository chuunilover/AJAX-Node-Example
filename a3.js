/*Handles all button clicks. Uses jQuery to save having to type out
document.getElementById(<button name>).
*********************************/

//JQuery to set the onclick for all the buttons.

//Button to request all tweets.
$("#allTweets").click(function(){
    requestTweets("allTweets");
});

//Button to request all users.
$("#allUsers").click(function(){
    requestTweets("users");
});

//Button to request all tweets with a URL in its text.
$("#allUrls").click(function(){
    requestTweets("urls");
});

//Button for info on specific tweet.
$("#someTweet").click(function(){
	var tweetid = prompt("Please enter a tweet ID", "<tweetid>");
	if (tweetid){
		requestTweets("tweet/" + tweetid);
	}
	else{
		alert("Please input a tweet ID.");
	}
});

//Button for info on specific user
$("#someUser").click(function(){
	var username = prompt("Please enter a username", "nobody");
	if (username){
		requestTweets("user/" + username);
	}
	else{
		alert("Please input a user name.");
	}
});

//Button for retweet with maximum count.
$("#maxRetweet").click(function(){
    requestTweets("maxRetweet");
});

//Request a tweet. Requests involve appending a specific query to the end of the web address.
function requestTweets (req_type) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200){
			document.getElementById("tweets").innerHTML = xhttp.responseText;
		}
	};
	try{
		xhttp.open("GET", "http://127.0.0.1:3000/" + req_type, true);
		xhttp.send(null);
	}
	catch(e){
		alert(e);
	}
}