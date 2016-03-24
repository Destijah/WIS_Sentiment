var express = require('express'),
    app = express();

const PORT=8080; 

// Serve static content. Look in the public directory
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
  res.sendFile('index.html', {root: __dirname});
});

   
console.log("Server listening on: http://localhost:%s", PORT);
app.listen(PORT);