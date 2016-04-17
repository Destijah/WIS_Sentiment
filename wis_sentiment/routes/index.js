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
	
	// TODO: sanity checking for start vs end dates
	// TODO: sanity checking for blank input
	// TODO: force a start and end date for topic
	// TODO: check tweet id as integer
	
	if (specifier == "topic")
	{
		controller.topic(tweet, start, end, 100, function(body){
			// Filter out data that is undefined
			tweets = body['tweets'].filter(function(x) { return x != undefined });
			error = body['error']
			sentiment = body['sentiment']
			res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
		});
	}
	else if (specifier == "tweet")
	{
		controller.id(tweet, function(body){
			tweets = body['tweets']
			error = body['error']
			sentiment = body['sentiment']
			res.render('tweets', { tweets: tweets, sentiment: sentiment, error: error });
		});
	}
});

module.exports = router;
