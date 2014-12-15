var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require("express-session");
var app = express();
var controllers = require("./controllers");
var flash = require("connect-flash");

// Setup the View Engine
app.set("view engine", "vash");

// Opt into Services
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({secret: 'keyboard cat', resave: false, saveUninitialized: true}));

app.use(flash());

// set the public static resource folder
app.use(express.static(__dirname + "/public"));

// use authentication
var auth = require("./auth");
auth.init(app);

// Map the routes
controllers.init(app);

app.get("/api/users", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send({name: "Shawn", isValid: true, group: "Admin"});
});

app.get("/api/sql", function (req, res) {
    var msnodesql = require("msnodesql");
    var connString = "Driver={SQL Server Native Client 11.0};Server=.\\sqlexpress12;Database=Northwind;Trusted_Connection={Yes}";

    msnodesql.query(connString, "SELECT * FROM Customers WHERE CustomerID = 'ALFKI'", function (err, results) {
        // Error Handling
        res.send(results);
    });
});

var server = http.createServer(app);

server.listen(3000);

var updater = require("./updater");
updater.init(server);
