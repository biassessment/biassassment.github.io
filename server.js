//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
//var bodyParser = require('body-parser')
var app = express();

 app.use(express.static(__dirname));


 /*
 app.use(bodyParser.json() );

 //Initialize DB
 var fs = require("fs");
 var file = 'answers.db';
 var exists = fs.existsSync(file);

 if(!exists) {
 console.log("Creating DB file.");
 fs.openSync(file, "w");
 }
 var sqlite3 = require('sqlite3').verbose();
 var db = new sqlite3.Database(file);

 db.serialize(function() {
 db.run("CREATE TABLE IF NOT EXISTS choices (id INTEGER PRIMARY KEY, name TEXT, choice01 INTEGER, choice02 INTEGER, choice03 INTEGER, choice12 INTEGER, choice13 INTEGER, choice23 INTEGER)");
 });

 // Save Answers
 app.post('/saveAnswers', function(req, res){
 console.log("save Answers", req.body);
 db.run(
 "INSERT OR IGNORE INTO choices(name, choice01, choice02, choice03, choice12, choice13, choice23) VALUES (?,?,?,?,?,?,?)",
 [req.body['name'], req.body['choice01'], req.body['choice02'], req.body['choice03'], req.body['choice12'], req.body['choice13'], req.body['choice23']], function(err){
 if (err){
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
 app.get('/getAllAnswers', function(req, res){
 db.all("SELECT * FROM choices", function(err, rows){
 if (err){
 console.log(err);
 res.status(400);

 } else {
 res.json(rows);
 }
 });
 });

 // Get Names
 app.get('/getAllNames', function(req, res){
 db.all("SELECT name FROM choices", function(err, rows){
 if (err){
 console.log(err);
 res.status(400);

 } else {
 res.json(rows);
 }
 });
 });

 // Empty DB
 app.get('/emptyDB', function(req, res){
 console.log("empty database", req.body);
 db.run(
 "DELETE FROM choices;", [], function(err){
 if (err){
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
*/


app.listen(process.env.PORT || 8080);