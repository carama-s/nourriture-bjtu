// Add globals
global._ = require("underscore");
global.common = require("./common");
global.api = require("./api");

var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-http-bearer').Strategy;

var config = require("./config.json");

// Mongoose config

mongoose.connect(config.mongoose.uri);

// Passport config

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  api.user.model.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new BearerStrategy(function(accessToken, next) {
  api.user.model.findOne()
  .elemMatch("tokens", {token: accessToken})
  .exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(null, undefined);
    return next(null, user);
  });
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

module.exports = {
  app: app,
  db: mongoose.connection
};
