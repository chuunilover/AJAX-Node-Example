A3 README/Documentation

Step 1: Setting up the files:
1: Download a3.zip
2: Extract the files and place them in any directory. The files all have to be in the same directory as each other.

Step 2: Setting up the JSON file:
1: Overwrite the old data.json with your new data.json. This data.json should be a properly formatted JSON file containing tweet data.
2: Ensure that in your directory, you have the following files:
•	a3.css
•	a3.js
•	data.json (This should be your test file)
•	index.html
•	Node.js

Step 3: How to test the API:
1: Using a terminal, enter the directory where all the files are stored
2: Run “node Node.js” without the quotes
3: Using a browser, to test each function of the API, go to:
•	Main page: http://127.0.0.1:3000 (or http://127.0.0.1:3000/)
•	All tweets: http://127.0.0.1:3000/allTweets
•	All users who have posted a tweet: http://127.0.0.1:3000/users
•	All tweets which contain a URL in the text: http://127.0.0.1:3000/urls
•	Tweet with specific ID: http://127.0.0.1:3000/tweet/<id> Replace <id> with the appropriate tweet ID. So if you want tweet 311964132205268992, you can access this by http://127.0.0.1:3000/tweet/311964132205268992
If no such tweet exists,
•	User with a specific username who has posted a tweet: http://127.0.0.1:3000/user/<id> Replace <id> with the appropriate username. So if you want user “zephoria”, this can be accessed by http://127.0.0.1:3000/user/zephoria
Note that HTML code is returned