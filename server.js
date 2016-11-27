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
    db.run("CREATE TABLE IF NOT EXISTS responses (" +
        "id INTEGER PRIMARY KEY, " +
        "alias TEXT, " +
        "answers TEXT," +
        "tool TEXT," +
        "decisionType FLOAT," +
        "easeOfuse FLOAT," +
        "usage FLOAT," +
        "benefit FLOAT," +
        "usefulness FLOAT," +
        "overall FLOAT," +
        "skill FLOAT," +
        "RegularReporting INTEGER," +
        "Assurance INTEGER," +
        "CostAnalysis INTEGER," +
        "GroupConsolidation INTEGER," +
        "OperationalPlanning INTEGER," +
        "OtherReporting INTEGER," +
        "StrategicPlanning INTEGER," +
        "MarketAnalysis INTEGER," +
        "CampaignManagement INTEGER," +
        "ProductionPlanning INTEGER," +
        "SupplyChain INTEGER," +
        "SupplierAnalysis INTEGER," +
        "HRAnalysis INTEGER)"
    );
    console.log("SQLite3 Database created");
});

// Save Answers
app.post('/saveResponse', function (req, res) {
    console.log("save Response", req.body);
    db.run(
        "INSERT OR IGNORE INTO responses(" +
        "alias, " +
        "answers, " +
        "tool, " +
        "decisionType, " +
        "usage, " +
        "benefit, " +
        "usefulness, " +
        "skill, " +
        "easeOfUse, " +
        "overall, " +
        "RegularReporting, " +
        "Assurance, " +
        "CostAnalysis, " +
        "GroupConsolidation, " +
        "OperationalPlanning, " +
        "OtherReporting, " +
        "StrategicPlanning, " +
        "MarketAnalysis, " +
        "CampaignManagement, " +
        "ProductionPlanning, " +
        "SupplyChain, " +
        "SupplierAnalysis, " +
        "HRAnalysis) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            req.body['alias'],
            req.body['answers'],
            req.body['tool'],
            req.body['decisionType'],
            req.body['usage'],
            req.body['benefit'],
            req.body['usefulness'],
            req.body['skill'],
            req.body['easeOfUse'],
            req.body['overall'],
            req.body['Regular financial & tax reporting (external reporting)'],
            req.body['Assurance & special compliance support (e.g. SOX)'],
            req.body['Cost Analysis'],
            req.body['Group Consolidation'],
            req.body['Operational Planning & Budgeting'],
            req.body['Other internal financial reporting'],
            req.body['Strategic Planning'],
            req.body['Market & Sales planning & analysis'],
            req.body['Campaign Management'],
            req.body['Production Planning & Control'],
            req.body['Supply-Chain-Analysis'],
            req.body['Supplier Analysis'],
            req.body['HR Analysis']

        ], function (err) {
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