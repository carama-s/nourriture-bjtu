var config = require("../config");
var Waterline = require("waterline");

function APP() {
  var obj = {};

  obj.initialize = function() {
    console.log("Initialize");
    var D = Q.defer();
    // Load services
    var services = require("../services");
    async.parallel(services, function(err, results) {
      if (err) return D.reject(err);
      _.extend(global, results);
      obj.services = results;

      var api = require("../api");
      // Load models and connect to database
      var tmp = require("./models.js")(api);
      var orm = new Waterline();
      _.forOwn(tmp, function(value, key) {
        orm.loadCollection(value);
      });
      orm.initialize(config.waterline, function(err, models) {
        if (err) return D.reject(err);

        var collections = _.transform(models.collections, function(result, value, key) {
          result[S(key).capitalize()] = value;
        });
        _.extend(global, collections);
        obj.models = collections;
        obj.connections = models.connections;

        // Load app
        var app = require("./app.js")(api);
        obj.app = app;

        // Socket.io config
        var server = require("http").Server(app);
        //var io = require("io.js");
        //io.addServer(server);
        obj.server = server;

        global.APP = obj;
        D.resolve();
      });
    });

    return D.promise;
  };

  return obj;
}


module.exports = APP();
