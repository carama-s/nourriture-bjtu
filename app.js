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
  User.findOne()
    .elemMatch("tokens", {token: accessToken})
    .exec()
    .then(function(user) {
      next(null, (!user) ? undefined : user);
    }, next);
}));

// Express config

var app = express();

if (app.get("env") === 'development') {
  app.set("trust proxy");
  app.set("json spaces", 2);
  app.use(morgan("dev"));
} else {
  app.set("trust proxy", "loopback");
  app.use(morgan("combined"));
}

//app.use(function(req, res, next) {
  var Origin = req.get("Origin");
  var isPreflight = false;
  if (Origin === undefined) return next();
  if (req.method == "OPTIONS") {
    var AccessControlRequestMethod = req.get("Access-Control-Request-Method");
    isPreflight = (AccessControlRequestMethod !== undefined);
  }
  if (isPreflight) {
    // Should check good header in Access-Control-Request-Method header
    var AccessControlRequestHeader = req.get("Access-Control-Request-Header");
    res.set("Access-Control-Allow-Method", "GET,HEAD,PUT,PATCH,POST,DELETE");
    if (AccessControlRequestHeader ==! undefined) res.set("Access-Control-Allow-Header", AccessControlRequestHeader);
  } else {
    // Maybe set Access-Control-Expose-Headers header
  }
  res.set("Access-Control-Allow-Origin", Origin);
  if (!isPreflight) return next();
  res.status(204).end();
});

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
    app.use("/" + model, api[model].router);
  }
}

if (app.get("env") === 'development') {
  app.use(require("errorhandler")());
}

module.exports = app;
