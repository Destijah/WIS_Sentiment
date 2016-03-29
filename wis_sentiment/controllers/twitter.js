var Twit = require('twit')

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

//tweetByTopic("nasa", "2016-02-21", "2016-03-23", count=100)
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
//tweetByID(541278904204668929);
