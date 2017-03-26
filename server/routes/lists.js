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
      res.sendStatus(500);
    } else {
      var listsQuery = 'SELECT * FROM "lists";';
      db.query(listsQuery,function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/add', function(req,res) {
  console.log("inside /add route");
  console.log("object received is: ", req.body);
  var list_name = req.body.list_name;
  // INSERT INTO "lists" ("list_name") VALUES ('New List');
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.sendStatus(500);
    } else {
      db.query('INSERT INTO "lists" ("list_name") VALUES ($1);',
      [list_name], function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.sendStatus(201); // succesful insert status
        }
      });
    }
  });
});

router.delete('/delete/:id', function(req,res) {
  var id = parseInt(req.params.id);
  console.log("Deleting list number:", id);
  // DELETE FROM "lists" WHERE "list_id" = 2;
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.sendStatus(500);
    } else {
      db.query('DELETE FROM "lists" WHERE "list_id" = $1;',[id], function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});


module.exports = router;
