var express = require("express");
var initMiddlewares = require("./middlewares.js");
var path = require("path");
var serveStatic = require("serve-static");

module.exports = function(api) {
  var app = express();
  app = initMiddlewares(app);

  var config = require("../config").http;
  var policies = require("../policies");

  _.forOwn(api, function(value, key) {
    var router = value.router;
    if (router === undefined) return;
    var prefix = config.prefix + "/" + key.toLowerCase();
    app.use(prefix, router(policies, "/" + key.toLowerCase()));
  });

  app.get(config.prefix + "/api-docs", function(req, res, next) {
    res.json(APP.swag.gen_api_doc());
  });

  app.use(config.prefix + "/ui", serveStatic(path.join(__rootDir, "ui")));

  if (app.get("env") === 'development') {
    app.use(require("errorhandler")());
  }

  return app;
};
