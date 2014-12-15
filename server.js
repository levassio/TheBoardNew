var http = require("http")
    , express = require("express")
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , expressSession = require("express-session")
    , app = express()
    , controllers = require("./controllers")
    , flash = require("connect-flash");

app.set("view engine", "vash");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({secret: 'keyboard cat', resave: false, saveUninitialized: true}));

app.use(flash());

app.use(express.static(__dirname + "/public"));

var auth = require("./auth");
auth.init(app);

controllers.init(app);

var server = http.createServer(app);
server.listen(3000);

var updater = require("./updater");
updater.init(server);
