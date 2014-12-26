var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-http-bearer').Strategy;
var api = require("./api");
var User = api.user.model;

// Passport config

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use(new BearerStrategy(function(accessToken, next) {
  User.findOne({token: {token: accessToken}}).exec()
    .then(function(user) {
      next(null, (!user) ? undefined : user);
    }, next);
}));

// Express config

var app = express();

if (app.get("env") === 'production') {
  app.set("trust proxy", "loopback");
  app.use(morgan("combined"));
} else if (app.get("env") === "test") {
  app.set("trust proxy");
} else {
  app.set("trust proxy");
  app.set("json spaces", 2);
  app.use(morgan("dev"));
}

app.use(require("cors")());
app.use(require("compression")());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(function(req, res, next) {
  passport.authenticate('bearer', {session: false}, function(err, user) {
    if (err) return next(err);
    if (!user) return next();
    req.logIn(user, function(err) {
      if (err) return next(err);
      next();
    });
  })(req, res);
});

for (model in api) {
  if (api[model].router !== undefined) {
    app.use("/api/" + model, api[model].router);
  }
}

if (app.get("env") === 'development') {
  app.use(require("errorhandler")());
}

// Socket.io config

var server = require("http").Server(app);
var io = require("io.js");
io.addServer(server);

module.exports = server;
