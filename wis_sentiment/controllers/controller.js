/**
This module is the controller for the tweet retrieval and sentiment analysis
of this application. This application supports searching texts by a topic, or 
searching a specific tweet id.

Searching by topic:
module.topic(search,   // Search topic
             since,    // Start date of tweets
             until,    // End day of tweets
             count,    // Number of tweets to retrieve (max 100)
             callback) // Callback function

Searching by id:
module.id(id,          // tweet id
          callback)    // callback function


The returned data structure is defined as 

{
    sentiment: int,
    tweets: [{
        text: tweet content,
        valence: <negative, neutral, positive>,
        polarity: tweet sentiment polarity,

        tweet_id: id of tweet,
        created_at: tweet creation date,
        name: user display name,
        screen_name: twitter user id,
        image: user profile image
    },{
        ...
    }]
    error: Error content if an error occurred in the backend
}

Error will be null if a successfull call was made. If an error occurred, the sentiment
and tweets will be null and error will be defined.
*/
var twitter = require('./twitter');
var sentiment = require('./sentiment');

var tweetCallback = function(tweets){
    var sentiments = tweets.map(function (tweet, i, arr){
                            return buildTweetData(tweet);
                    })

    var data = {
        sentiment: totalSentiment(sentiments),
        tweets: sentiments,
        error: null
    }
    return data;
}

var totalSentiment = function(tweets){
    var total = tweets.reduce(function(prev, curr, idx, arr){
                    return prev + curr.polarity;
    }, 0)
    return total;
}

var buildTweetData = function(tweet){
    var data = sentiment.textSentiment(tweet.text);
    data.tweet_id = tweet.id_str;
    data.created_at = tweet.created_at;
    data.name = tweet.user.name;
    data.screen_name = tweet.user.screen_name;
    data.image = tweet.user.profile_image_url;
    return data;
}

var tweetIdCallback = function(tweet){
    var data = buildTweetData(tweet);
    var returned = {
        sentiment: data.polarity,
        tweets: [data],
        error: null
    }

    return returned;
}

module.exports = {
	topic: function topicController(search, since, until, count, callback){
		twitter.tweetByTopic(search, since, until, count)
                        .then(tweetCallback)
                        .then(callback)
                        .catch(function(err){
                            var data = {
                                sentiment: null,
                                tweets: null,
                                error: err
                            }
                            return data
                        })
	},

	id: function idController(id, callback){
		twitter.tweetByID(id)
                    .then(tweetIdCallback)
                    .then(callback)
                    .catch(function(err){
                        var data = {
                                sentiment: null,
                                tweets: null,
                                error: err
                            }
                        return data;
                    })
	}
};
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
//topicController("trump", "2016-01-21", "2016-04-29", 100000, console.log)
//idController("541278904204668929", console.log)

// EXAMPLES
// module.exports.topic("trump", "2016-01-21", "2016-04-29", 100, function(arr){
//     // Filter out data that is undefined

//     // Will print out all tweets
//     console.log(arr.sentiment)
//     console.log(arr.tweets[0].created_at)
//     console.log(arr.tweets[arr.tweets.length-1].created_at)
//     // for(var i =0; i<arr.tweets.length;i++){
//     //     console.log(arr.tweets[i].tweet_id + "    " +i)
//     // }
// })

// module.exports.id("11111", function(tweet){
//     console.log(tweet)
// })