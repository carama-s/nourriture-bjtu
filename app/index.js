var config = require("../config");
var Waterline = require("waterline");
var IO = require("./io.js");
var Swagger = require("./swagger.js");

function APP() {
  var obj = {};
  global.APP = obj;
  obj.config = config;
  var io = new IO();
  obj.io = io;
  obj.swag = new Swagger();

  obj.initialize = function() {
    console.log("Initializing...");
    // Load services
    console.log("Loading services...");
    var services = require("../services");
    return Q.nfcall(async.parallel, services).then(function(results) {
      console.log("Services loaded !")
      _.extend(global, results);
      obj.services = results;

      var api = require("../api");
      // Load models and connect to database
      console.log("Loading models...");
      var tmp = require("./models.js")(api);
      var orm = new Waterline();
      _.forOwn(tmp, function(value, key) {
        orm.loadCollection(value);
      });
      console.log("Models loaded !");
      console.log("Connecting to DB...");
      return Q.ninvoke(orm, "initialize", config.waterline).then(function(models) {
        console.log("Connected to DB !");

        var collections = _.transform(models.collections, function(result, value, key) {
          result[S(key).capitalize()] = value;
        });
        _.extend(global, collections);
        obj.models = collections;
        obj.connections = models.connections;
        obj.orm = orm;

        // Load app
        console.log("Loading express app...");
        var app = require("./app.js")(api);
        obj.app = app;
        console.log("Express app loaded !");

        // HTTP Server
        var server = require("http").Server(app);
        obj.server = server;

        // Socket.io config
        io.addServer(server);
      });
    });
  };

  obj.stop = function() {
    if (!obj.orm) return Q();
    return Q.ninvoke(orm, "teardown");
  };

  return obj;
}


module.exports = APP();
