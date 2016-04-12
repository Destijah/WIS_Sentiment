// Preprocessing
// Filter out all tweets that are not english. lang: en
var twitter = require('./twitter');
var sentiment = require('./sentiment');

var tweetCallback = function(tweets){
    var sentiments = tweets.map(function (tweet, i, arr){
                        if(tweet.lang === "en"){
                            return tweetIdCallback(tweet);
                        }
                    })
    return sentiments;
}

var tweetIdCallback = function(tweet){
    var data = sentiment.textSentiment(tweet.text);
    data.tweet_id = tweet.id_str;
    data.created_at = tweet.created_at;
    data.name = tweet.user.name;
    data.screen_name = tweet.user.screen_name;
    data.image = tweet.user.profile_image_url;
    //console.log(data);
    return data
}

module.exports = {
	topic: function topicController(search, since, until, count, callback){
		twitter.tweetByTopic(search, since, until, count)
                        .then(tweetCallback)
                        .then(callback)
                        .catch(function(err){
                            return err
                        })
	},

	id: function idController(id, callback){
		twitter.tweetByID(id)
                    .then(tweetIdCallback)
                    .then(callback)
                    .catch(function(err){
                        // console.log(typeof(err));
                        // console.log(err.text == undefined);
                        return err;
                    })
	}
};
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
//topicController("trump", "2016-01-21", "2016-04-29", 100000, console.log)
//idController("541278904204668929", console.log)

// EXAMPLES
//topicController("trump", "2016-01-21", "2016-04-29", 10000, function(arr){
    // Filter out data that is undefined
    //arr = arr.filter(function (x) {return x != undefined})

    // Will print out all tweets
    // for(var i =0; i<arr.length;i++){
    //     console.log(arr[i] + "    " +i)
    // }
//})

// module.exports.id("111", function(tweet){
//     console.log(typeof(tweet));
//     console.log(tweet)

// })