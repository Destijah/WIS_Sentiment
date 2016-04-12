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
		controller.topic(tweet, start, end, 100, function(arr){
			// Filter out data that is undefined
			arr = arr.filter(function (x) {return x != undefined});
			res.render('tweets', { twit: arr });
		});
	}
	else if (specifier == "tweet")
	{
		controller.id(tweet, function(body){
			res.render('tweets', { twit: body });
		});
	}
});

module.exports = router;
