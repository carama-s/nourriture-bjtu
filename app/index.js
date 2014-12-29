var config = require("../config");
var Waterline = require("waterline");

function APP() {
  var obj = {};
  obj.config = config;

  obj.initialize = function() {
    console.log("Initializing...");
    global.APP = obj;
    var D = Q.defer();
    // Load services
    console.log("Loading services...");
    var services = require("../services");
    async.parallel(services, function(err, results) {
      if (err) return D.reject(err);
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
      orm.initialize(config.waterline, function(err, models) {
        if (err) return D.reject(err);
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

        // Socket.io config
        var server = require("http").Server(app);
        //var io = require("io.js");
        //io.addServer(server);
        obj.server = server;

        D.resolve();
      });
    });

    return D.promise;
  };

  return obj;
}


module.exports = APP();
