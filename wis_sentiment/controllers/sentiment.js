var Retext = require('retext'),
    sentiment = require('retext-sentiment');

var retext = Retext().use(sentiment);

function textSentiment(text){
    var data;
    retext.process(text, function (err, tree) {
        // For some reason, the actual sentiment data is buried way down in this tree
        var sentimentTree = tree.data.retext.tree;

        // Data isnt there for some reason
        if (!sentimentTree.data) {
            console.log(sentimentTree);
            console.log("error")
            return
        }

        // Only keep track of the original text, and it's sentiment
        data = {
            text: text,
            valence: sentimentTree.data.valence,
            polarity: sentimentTree.data.polarity
        }
    })
    return data;
}

module.exports = {
    textSentiment: textSentiment
};