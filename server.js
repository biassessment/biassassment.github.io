//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());


//Initialize DB
var fs = require("fs");
var file = 'responses.db';
var exists = fs.existsSync(file);

if (!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY, alias TEXT, answers TEXT)");
  console.log("SQLite3 Database created");
});

// Save Answers
app.post('/saveResponse', function (req, res) {
  console.log("save Response", req.body);
  db.run(
    "INSERT OR IGNORE INTO responses(alias, answers) VALUES (?,?)",
    [req.body['alias'], req.body['answers']], function (err) {
      if (err) {
        console.log(err);
        res.status(500);
      }
      else {
        console.log("SAVED! mit ID: " + this.lastID);
        res.status(202);
      }
      res.json({"id": this.lastID});
      res.end();
    });
});

// Get all Answers
app.get('/getAllResponses', function (req, res) {
  db.all("SELECT * FROM responses", function (err, rows) {
    if (err) {
      console.log(err);
      res.status(400);

    } else {
      res.json(rows);
    }
  });
});

// Get all Names
/*
app.get('/getAllResponses', function (req, res) {
  db.all("SELECT alias FROM responses", function (err, rows) {
    if (err) {
      console.log(err);
      res.status(400);

    } else {
      res.json(rows);
    }
  });
});
*/

// Empty DB
app.get('/emptyDB', function (req, res) {
  console.log("empty database", req.body);
  db.run(
    "DELETE FROM responses;", [], function (err) {
      if (err) {
        console.log(err);
        res.status(500);
      }
      else {
        console.log("Emptied database. ");
        res.status(202);
      }
      res.json({"result": "emptied"});
      res.end();
    });
});

app.listen(process.env.PORT || 8080);