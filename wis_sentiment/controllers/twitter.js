var Twit = require('twit');
var Q = require('q');

var keys = keys = {
  "consumer_key": "h7RK9eo3zmThwpzuuAZ6s3Ymb",
  "consumer_secret": "66TdFhKX9gnVBdXpAHSvd8jJl9ld08YwqLBCCLjh7QzvRQarNb",
  "access_token": "494539844-9O29cx6u66hsbcbrgvizMRwJQqFZmjguFWdzp9yE",
  "access_token_secret": "8uzKFqMon5ptQbts7OXxSTMwWzyR6xEuHAQIcZdvyj7Jo"
};

var T = new Twit(keys);

function tweetByTopic(topic, start_time, end_time, count){
    var query = topic.concat(" since:", start_time, " until:", end_time);

    var deferred = Q.defer();
    T.get('search/tweets', { q: query, count: count, lang: "en" }, 
        function(err, data, response) {
        	if (err){
        		deferred.reject(err);
        	}
        	else{
            	deferred.resolve(data.statuses);
        	}
    })
    return deferred.promise;
}

function tweetByID(tweet_id){
    // Passing in the string representation of a number will retrieve
    // The correct tweet, but passing in a numerical value will
    // Return an error. This code below doesn't fix it either...
    if (typeof(tweet_id) == "number"){
        tweet_id = tweet_id.toString();
    }

    var deferred = Q.defer();
    T.get('statuses/show', { id: tweet_id }, 
        function(err, data, response){
            if (err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(data);
            }
    })
    return deferred.promise;
}

module.exports = {
	tweetByID : tweetByID,
	tweetByTopic : tweetByTopic
};