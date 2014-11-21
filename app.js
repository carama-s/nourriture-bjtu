// Add globals
global.common = require("./common");
global.api = require("./api");

var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");

var config = require("./config.json");

// Mongoose config

mongoose.connect(config.mongoose.uri);

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
