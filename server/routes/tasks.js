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

router.get('/:list_id', function(req,res) {
  var list_id = parseInt(req.params.list_id);
  // SELECT * FROM "tasks" WHERE "list_id" = 3;
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.sendStatus(500);
    } else {
      var listsQuery = 'SELECT * FROM "tasks" WHERE "list_id" = $1;';
      db.query(listsQuery, [list_id],function(queryError,result) {
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
  console.log("inside /tasks/add route");
  console.log("object received is: ", req.body);
  var task_description = req.body.task_description;
  var priority = parseInt(req.body.priority);
  var list_id = parseInt(req.body.list_id);
  var doneColumn = false;
  var notes = req.body.notes;
  // INSERT INTO "tasks" ("task_description","priority","list_id","done","due_date","notes") VALUES ($1,$2,$3,$4,$5,$6);
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.sendStatus(500);
    } else {
      var insertQuery = 'INSERT INTO "tasks" ("task_description","priority",'+
          '"list_id","done","notes") VALUES ($1,$2,$3,$4,$5);';
      db.query(insertQuery,[task_description,priority,list_id,doneColumn,notes],
            function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error making query',queryError);
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
  console.log("Deleting task number:", id);
  // DELETE FROM "tasks" WHERE "task_id" = 2;
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.sendStatus(500);
    } else {
      db.query('DELETE FROM "tasks" WHERE "task_id" = $1;',[id], function(queryError,result) {
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
