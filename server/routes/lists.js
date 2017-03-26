var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  database: 'chi',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

router.get('/', function(req,res) {
  // SELECT * FROM "lists";
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.send(500);
    } else {
      // We connected
      var listsQuery = 'SELECT * FROM "lists";';

      db.query(listsQuery,function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error making query');
          res.send(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

module.exports = router;
