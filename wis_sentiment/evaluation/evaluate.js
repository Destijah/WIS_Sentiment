var twitter = require('../controllers/twitter');
var sentiment = require('../controllers/sentiment');
var LineReaderSync = require("line-reader-sync");

//filename = "../data/1041MySpace.txt"
//filename = "../data/bbc1000.txt"
//filename = "../data/digg1084.txt"
//filename = "../data/rw1046.txt"
//filename = "../data/twitter4242.txt"
//filename = "../data/YouTube3407.txt"
filename = process.argv[2];

var lrs = new LineReaderSync(filename)
var confusionmatrix = [[0, 0, 0],
                       [0, 0, 0],
                       [0, 0, 0]];

var valencedict = {
    "negative": 0,
    "neutral": 1,
    "positive": 2
}

function calculateStats(matrix, cls){

    var l = matrix.length;
    var tp = matrix[cls][cls]
    var fn = -tp;
    for(var i=0; i<l; i++){
        fn += matrix[i][cls]
    }
    var fp = -tp;
    for(var i=0; i<l; i++){
        fp += matrix[cls][i]
    }
    var total = 0;
    for(var i=0; i<l; i++){
        for(var j=0; j<l; j++){
            total += matrix[i][j];
        }
    }
    var tn = total - tp - fp - fn;

    var precision = tp / (tp + fp);
    var recall = tp / (tp + fn);
    var accuracy = (tp + tn) / (tp + tn +fp+fn);

    var data = {
        tp: tp,
        fp: fp,
        fn: fn,
        tn: tn,
        total: total,
        precision: precision,
        recall: recall,
        accuracy: accuracy
    }
    return data;
}

var printStats = function () {
    var precision = 0;
    var recall = 0;
    var accuracy = 0;
    var n = confusionmatrix.length; // number of classes

    // Calculate the macroaverage of precision/recall/accuracy
    for(var i=0; i < n; i++){
        var data = calculateStats(confusionmatrix, i);
        precision += data.precision;
        recall += data.recall;
        accuracy += data.accuracy;
        //console.log(data)
    }
    console.log("Confusion matrix");
    console.log("  neg  neut pos");
    confusionmatrix.forEach(function(arr){
        console.log(arr)
    })
    console.log("Precision -----> " + precision / n)
    console.log("Recall ------> " + recall / n);
    console.log("Accuracy ------> "+accuracy / n)
}


console.log("<-----Evaluating sentiment with file: " + filename + "----->");
lrs.readline(); // Throw away header line
while (true) {
    var line = lrs.readline()

    if (line === null) {
        printStats();
        console.log("Finished!")
        process.exit();
    }
    else {
        var data = line.split("\t");
        var meanPos = data[0];
        var meanNeg = data[1];
        var text = data[2];
        var polarity = meanPos - meanNeg;
        var valence;

        // Do binary evaluation
        if(polarity < 0){
            valence = "negative";
        }
        else if(polarity == 0){
            valence = "neutral";
        }
        else{
            valence = "positive";
        }
        var testData = sentiment.textSentiment(text);
        var predvalence = testData.valence;

        // Row is actual value, column is predicted
        confusionmatrix[valencedict[valence]][valencedict[predvalence]] += 1;
    }
}
