var express = require("express");
var middlewares = require("./middlewares");
var path = require("path");
var serveStatic = require("serve-static");

module.exports = function(api) {
  var app = express();
  app = middlewares.before(app);

  var config = APP.config.http;
  var policies = require("./policies");

  _.forOwn(api, function(value, key) {
    var router = value.router;
    if (router === undefined) return;
    var prefix = "/" + key.toLowerCase();
    app.use(config.prefix + prefix, router(policies, prefix));
  });

  app.get(config.prefix + "/api-docs", function(req, res, next) {
    res.json(APP.swag.gen_api_doc());
  });

  app.use(config.prefix + "/ui", serveStatic(path.join(__rootDir, "ui")));
  app.use("/uploads", serveStatic(path.join(__rootDir, "uploads")));

  app = middlewares.after(app);

  return app;
};
