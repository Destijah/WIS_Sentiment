var Retext = require('retext'),
    sentiment = require('retext-sentiment');

var retext = Retext().use(sentiment);

function tweetSentiment(tweet, callback){
	retext.process(tweet.text, function (err, tree) {
		// For some reason, the actual sentiment data is buried way down in this tree
	    var sentimentTree = tree.data.retext.tree;

	    // Data isnt there for some reason
		if (!sentimentTree.data) {
			console.log(sentimentTree);
			return
		}

		var point = {
			tweet: tweet.text,
			valence: sentimentTree.data.valence,
			polarity: sentimentTree.data.polarity
		}
		callback(point);
	})
}