// var twitter = require('twitter.js'),
//  sentiment = require('sentiment.js');

// Preprocessing
// Filter out all tweets that are not english. lang: en

var Retext = require('retext'),
    sentiment = require('retext-sentiment');

var Twit = require('twit')

var retext = Retext().use(sentiment);

var keys = keys = {
  "consumer_key": "xxx",
  "consumer_secret": "xxx",
  "access_token": "xxx",
  "access_token_secret": "xxx"
};

var T = new Twit(keys);

function tweetByTopic(topic, start_time, end_time, count, callback){
    var query = topic.concat(" since:", start_time, " until:", end_time);

    T.get('search/tweets', { q: query, count: count }, 
        function(err, data, response) {
            data.statuses.forEach(callback)
    })
}

function tweetByID(tweet_id, callback){
    // Passing in the string representation of a number will retrieve
    // The correct tweet, but passing in a numerical value will
    // Return an error. This code below doesn't fix it either...
    if (typeof(tweet_id) == "number"){
        tweet_id = tweet_id.toString();
    }
    T.get('statuses/show', { id: tweet_id }, 
        function(err, data, response) {
                callback(data)
    })
}

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

function controller(){
    var sentimentCallback = function(sentiment){
        console.log(sentiment);
    }
    var tweetCallback = function(tweet){
        if(tweet.lang === "en"){
            tweetSentiment(tweet, sentimentCallback);
        }
    }
    
    tweetByTopic("#trump", "2016-01-21", "2016-03-29", count=100, tweetCallback);

    //tweetByID("541278904204668929", tweetCallback);
    
}
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
controller()