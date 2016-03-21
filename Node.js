var http = require('http');
var fs = require('fs');
var jsonFileObj = require("./data.json");
var path = require('path');
var url = require("url");
var PORT = 3000;

//Match <a>.<b> where <a> and <b> have no whitespace and at least 1 character (aka a link)
var link_pattern = /\S\S*\.\S\S*/;

//create server; listen on port 3000
var server = http.createServer(function(req, res) {
	//Allows the header to be set, including the return code.
	res.setHeader('Access-Control-Allow-Origin', '*')
	var reqtype = req.url;
	console.log(reqtype);
	
	//Large "case statement" handling separate cases for each valid request url.
	if (reqtype == "/allTweets"){
		handleAllTweets(res);
	}
	else if(reqtype == "/" || reqtype == "") {
		handleMainPage(res);
	}
	else if(reqtype == "/a3.js") {
		handleJScript(res);
	}
	else if(reqtype == "/jQuery.js") {
		handleJQuery(res);
	}
	else if(reqtype =="/a3.css"){
		handleCSS(res);
	}
	else if(reqtype == "/users") {
		handleUsers(res);
	}
	else if(reqtype == "/urls"){
		handleURLs(res);
	}
	else if(reqtype.search("\/tweet\/") == 0) {
		var tid = path.basename(req.url);
		handleSingleTweet(res, tid);
	}
	else if(reqtype.search("\/user\/") == 0) {
		var username = path.basename(req.url);
		handleSingleUser(res, username);
	}
	else if(reqtype == "/maxRetweet"){
		handleMaxRetweet(res);
	}
});

server.listen(PORT);

/* The following functions process individual commands sent by the URL of the AJAX request. */

//Return all tweet information.
function handleAllTweets(response){
		response.writeHead(200);
		response.write("[\r\n<br />");
		response.write(getTweets());
		response.write("]");
		response.end();
}

//Return index.html
function handleMainPage(response){
	fs.readFile("index.html", function(err, data) {
		if(err){
			response.writeHead(404);
			response.end();
		}
		else{
			response.writeHead(200, {'content-type':'text/html'});
			response.write(data);
			response.end();
		}
	});
}

//Return a3.js (contains AJAX for index.html)
function handleJScript(response){
	fs.readFile("a3.js", function(err, data) {
		if(err){
			response.writeHead(404);
			response.end();
		}
		else{
			response.writeHead(200, {'content-type':'text/javascript'});
			response.write(data);
			response.end();
		}
	});
}

//Return jQuery.js (JQuery library)
function handleJQuery(response){
	fs.readFile("jQuery.js", function(err, data) {
		if(err){
			response.writeHead(404);
			response.end();
		}
		else{
			response.writeHead(200, {'content-type':'text/javascript'});
			response.write(data);
			response.end();
		}
	});
}

//Return a3.css (CSS file for index.html).
function handleCSS(response){
	fs.readFile("a3.css", function(err, data) {
		if(err){
			response.writeHead(404);
			response.end();
		}
		else{
			response.writeHead(200, {'content-type':'text/css'});
			response.write(data);
			response.end();
		}
	});
}

//Return a list of all the users' information.
function handleUsers(response){
	response.writeHead(200);
	var users = getUsers();
	response.write("User list:\r\n<br />[");
	for (i = 0; i < users.length; i++) {
		response.write(users[i] + "\r\n<br />");
	}
	response.write("]");
	response.end();
}

//Return a list of info on all tweets that have a link within the text.
//A link is defined as having <a>.<b> where <a> and <b> are non-empty strings that lack whitespace.
function handleURLs(response){
	response.writeHead(200);
	var urls = getURLs();
	response.write("URL list:\r\n<br />[");
	for (i = 0; i < urls.length; i++) {
		response.write(urls[i] + "\r\n<br />");
	}
	response.write("]");
	response.end();
}

//Return information on a tweet with id=tweetid.
//If no such tweet exists, return "No such tweet with id=<tweetid>".
function handleSingleTweet(response, tweetid){
	var tweet = findTweet(tweetid);
	response.writeHead(200);
	if(tweet){
		response.write("Info on tweet with id=" + tweetid + ":<br />\r\n" + JSON.stringify(tweet))
	}
	else{
		response.write("No such tweet with id=" + tweetid + " found.");
	}
	response.end();
}

//Return information on a user with username=username.
//If no such tweet exists, return "No such tweet with username=<username>".
function handleSingleUser(response, username){
	var user = findUser(username);
	response.writeHead(200);
	if(user){
		response.write("Info on user with username=" + username + ":<br />\r\n" + JSON.stringify(user));
	}
	else{
		response.write("No such user found.");
	}
	response.end();
}

//Return information about the tweet which has the highest retweet count.
function handleMaxRetweet(response){
	var maxRetweet = findMaxRetweet();
	response.writeHead(200);
	if(maxRetweet){
		response.write(maxRetweet);
	}
	else{
		response.write("No tweets found.");
	}
	response.end();
}


/* The following functions help process the JSON object of tweets and
 * formats them into a human-readable html-friendly format for the browser
 * to use. */
 
//Return all tweets as JSON strings.
function getTweets() {
	var returnString = "";
	for(i = 0; i < jsonFileObj.length; i++){
		returnString = returnString + "{\r\n<br />" +
			"\"created-at\": \"" + jsonFileObj[i].created_at + "\"\r\n<br />" +
			"\"id_str\": \"" + jsonFileObj[i].id_str + "\"\r\n<br />" +
			"\"text\": \"" +  jsonFileObj[i].text + "\"\r\n<br />" +
			"}\r\n<br />";
	}
	return returnString
}

//Return all users.
function getUsers() {
	var userList = [];
	for(i = 0; i < jsonFileObj.length; i++){
		if (conditionalPush(userList, "{\r\n<br />\"screen_name\": \"" + jsonFileObj[i].user.screen_name + "\",")) {
			userList.push("\"id_str\": \"" + jsonFileObj[i].user.id_str + "\",");
			userList.push("\"location\": \"" + jsonFileObj[i].user.location + "\"\r\n<br />}");
		}
	}
	return userList;
}

//Return all tweets where text contains a link. (Define as <a>.<b> where a and b are non empty,
//non whitespace containing strings.
function getURLs() {
	var urls = [];
	for(i = 0; i < jsonFileObj.length; i++){
		if (jsonFileObj[i].text.search(link_pattern) >= 0) {
			urls.push("{\r\n<br />\"screen_name\": \"" + jsonFileObj[i].user.name + "\",");
			urls.push("\"url\": \"" + jsonFileObj[i].text.match(link_pattern)[0] + "\",");
			urls.push("\"text\": \"" + jsonFileObj[i].text + "\"\r\n<br />}");
		}
	}
	return urls;
}

//Return a JSON object of a user with screen_name equal to username.
//Return null if no such user exists.
function findUser(username) {
	for(i = 0; i < jsonFileObj.length; i++){
		if (jsonFileObj[i].user.screen_name == username) {
			return jsonFileObj[i].user;
		}
	}
	//if no matching user found, return null
}

//Push item onto list iff list does not contain item.
function conditionalPush(list, item) {
	//If you're wondering why I chose j here, blame dynamic scope.
	//If I had used i instead, getUsers() and conditionalPush would be sharing the same value for i, despite being in separate functions.
	for (j = 0; j < list.length; j++) {
		if (list[j] == item){
			return false;
		}
	}
	list.push(item);
	return true
}

//Return tweet with id=tweetnumber if one exists. Else return null.
function findTweet(tweetnumber){
	for(i = 0; i < jsonFileObj.length; i++){
		if (jsonFileObj[i].id_str == tweetnumber) {
			return jsonFileObj[i];
		}
	}
}

//Return information on the tweet with the highest number of retweets for all tweets in
//the database of tweets.
function findMaxRetweet(){
	var maxRetweets = -1;
	var indexWithMaxRetweets = -1;
	for(i = 0; i < jsonFileObj.length; i++){
		if (jsonFileObj[i].retweet_count > maxRetweets) {
			maxRetweets = jsonFileObj[i].retweet_count;
			indexWithMaxRetweets = i;
		}
	}
	if(maxRetweets > -1){
		return "{\r\n<br />" +
			"\"id_str\": \"" + jsonFileObj[indexWithMaxRetweets].id_str + "\"\r\n<br />" +
			"\"text\": \"" +  jsonFileObj[indexWithMaxRetweets].text + "\"\r\n<br />" +
			"\"retweet_count\": \"" + jsonFileObj[indexWithMaxRetweets].retweet_count + "\"\r\n<br />" +
			"}";
	}
}