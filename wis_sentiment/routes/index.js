var controller = require('../controllers/controller');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.get('/tweets', function(req, res) {
//	res.render('tweets', { twit: 'baloney' });
//});

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
				tweets = body['tweets'].filter(function(x) { return x != undefined });
				error = body['error']
				sentiment = body['sentiment']
				res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
			});
		}
	}
	else if (specifier == "tweet")
	{
		if (isNaN(tweet) || tweet.indexOf('.') != -1)
		{
			res.render('tweets', { error: "Tweet id must be an integer!" });
		}
		controller.id(tweet, function(body){
			tweets = body['tweets']
			error = body['error']
			sentiment = body['sentiment']
			res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
		});
	}
});

module.exports = router;
