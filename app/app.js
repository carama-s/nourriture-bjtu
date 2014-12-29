var express = require("express");
var initMiddlewares = require("./middlewares.js");

module.exports = function(api) {
  var app = express();
  app = initMiddlewares(app);

  var config = require("../config").http;
  var policies = require("../policies");

  _.forOwn(api, function(value, key) {
    var router = value.router;
    if (router === undefined) return;
    var prefix = config.prefix + "/" + key.toLowerCase();
    app.use(prefix, router(policies));
  });

  if (app.get("env") === 'development') {
    app.use(require("errorhandler")());
  }

  return app;
};
