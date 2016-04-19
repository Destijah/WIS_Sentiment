var controller = require('../controllers/controller');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/tweets', function(req, res) {
	var start = req.body.start;
	var end = req.body.end;
	var tweet = req.body.tweet;
	var specifier = req.body.specifier;

	if (tweet == "")
	{
		res.render('tweets', { error: "The tweet input field cannot be blank!" });
	}
	else if (specifier == "topic")
	{
		if (start == "" || end == "")
		{
			res.render('tweets', { error: "Both a start and end date must be provided to search tweets by topic!" });
		}
		else if (end < start)
		{
			res.render('tweets', { error: "Start date cannot be more recent than the end date!" });
		}
		else
		{
			controller.topic(tweet, start, end, 100, function(body){
				// Filter out data that is undefined
				var tweets = body['tweets'].filter(function(x) { return x != undefined });
				var error = body['error']
				var sentiment = body['sentiment']

				if (error != null)
				{
					if (error.message != null && error.message.indexOf("getaddrinfo")  == -1)
					{
						error = error.message;
					}
					else
					{
						error = "Undefined error."
					}
				}
				
				if (!tweets.length)
				{
					res.render('tweets', { error: "No results found for your search..." });
				}
				else
				{
					res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
				}
			});
		}
	}
	else if (specifier == "tweet")
	{
		if (isNaN(tweet) || tweet.indexOf('.') != -1)
		{
			res.render('tweets', { error: "Tweet id must be an integer!" });
		}
		else
		{
			controller.id(tweet, function(body){
				var tweets = body['tweets']
				var error = body['error']
				var sentiment = body['sentiment']
				
				if (error != null)
				{
					if (error.message != null && error.message.indexOf("getaddrinfo")  == -1)
					{
						error = error.message;
					}
					else
					{
						error = "Undefined error."
					}
				}
				
				res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
			});
		}
	}
});

module.exports = router;
