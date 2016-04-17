var Twit = require('twit');
var Q = require('q');

var keys = keys = {
  "consumer_key": "h7RK9eo3zmThwpzuuAZ6s3Ymb",
  "consumer_secret": "66TdFhKX9gnVBdXpAHSvd8jJl9ld08YwqLBCCLjh7QzvRQarNb",
  "access_token": "494539844-9O29cx6u66hsbcbrgvizMRwJQqFZmjguFWdzp9yE",
  "access_token_secret": "8uzKFqMon5ptQbts7OXxSTMwWzyR6xEuHAQIcZdvyj7Jo"
};

var T = new Twit(keys);

// var promiseWhile = function(condition, action) {
//     var resolver = Q.defer();

//     var loop = function() {
//         if (!condition()) return resolver.resolve();
//         return Q.resolve(action())
//             .then(loop)
//             .catch(resolver.reject);
//     };

//     process.nextTick(loop);

//     return resolver.promise;
// };

// function tweetByTopic(topic, start_time, end_time, count){
//     var query = encodeURI(topic.concat(" since:", start_time, " until:", end_time));

//     var deferred = Q.defer();
//     var tweets = [];
//     var newTweets = [null]; // must not be empty for initial condition to be met
//     var maxId = 0;
//     var remainingCount = count;

    
//     promiseWhile(function () {
//     	console.log(newTweets.length)
//     	console.log(remainingCount)
//     	return newTweets.length > 0 && remainingCount > 0;
//     }, function(){
//     	return Q.Promise(function(resolve, reject){
//     		var currCount = Math.min(100, remainingCount);
//     		var parameters = {q: query, count: currCount, result_type: "recent", lang: "en"};

//     		if (maxId > 0){
//     			parameters.max_id = maxId;
//     		}
//     		T.get('search/tweets', parameters)
//     		.catch(function(err){
//     			reject(new Error(err));
//     		}).then(function(result){
// 		    	newTweets = result.data.statuses;
// 		    	remainingCount -= currCount;

// 		    	maxId = newTweets[newTweets.length - 1];
// 		    	tweets = tweets.concat(newTweets);
// 		    	resolve(tweets)
//     		})

//     	}).then(function(){
//     		deferred.resolve(tweets)
//     	})
//     })

//     return deferred.promise;
// }
function tweetByTopic(topic, start_time, end_time, count){
    var query = encodeURI(topic.concat(" since:", start_time, " until:", end_time));

    var deferred = Q.defer();
    T.get('search/tweets', { q: query, count: count }, 
        function(err, data, response) {
        	if (err){
        		deferred.reject(new Error(err));
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
                deferred.reject(new Error(err));
            }
            else{
                deferred.resolve(data.statuses);
            }
    })
    return deferred.promise;
}

//tweetByTopic("nasa", "2016-02-21", "2016-03-23", count=100)
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
//tweetByID(541278904204668929);

module.exports = {
	tweetByID : tweetByID,
	tweetByTopic : tweetByTopic
};