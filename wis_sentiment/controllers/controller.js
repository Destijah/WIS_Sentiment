// Preprocessing
// Filter out all tweets that are not english. lang: en
var twitter = require('./twitter');
var sentiment = require('./sentiment');

var tweetCallback = function(tweets){
    var sentiments = tweets.map(function (tweet, i, arr){
                        if(tweet.lang === "en"){
                            var data = sentiment.textSentiment(tweet.text);
                            data.tweet_id = tweet.id_str;
                            data.name = tweet.user.name;
                            data.screen_name = tweet.user.screen_name;
                            data.image = tweet.user.profile_image_url;
                            return data
                        }
                    })
    return sentiments;
}

function controller(search, since, until, count, callback){
    
    twitter.tweetByTopic(search, since, until, count)
                        .then(tweetCallback)
                        .then(callback)

    //console.log(tweets);
    //tweetByID("541278904204668929", tweetCallback);
    
}
//tweetByTopic("#trump", "2016-03-21", "2016-03-24", count=100)
controller("trump", "2016-01-21", "2016-03-29", 100, console.log)