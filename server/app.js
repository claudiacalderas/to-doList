var express = require('express');
var bodyParser = require('body-parser');
var lists = require('./routes/lists.js');
var tasks = require('./routes/tasks.js');
var app = express();
var port = 7070;

app.use(express.static('server/public',{index: 'views/index.html'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/lists',lists);
app.use('/tasks',tasks);

app.listen(port);
console.log("Listening on port: ", port);
