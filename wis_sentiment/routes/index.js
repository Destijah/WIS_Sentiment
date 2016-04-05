var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tweets', function(req, res) {
	res.render('tweets', { twit: 'baloney' });
});

router.post('/test', function(req, res) {
	console.log(req);
});

module.exports = router;
