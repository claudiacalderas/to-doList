var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 7070;

app.use(express.static('server/public',{index: 'views/index.html'}));

app.listen(port);
console.log("Listening on port: ", port);
