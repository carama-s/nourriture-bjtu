var config = require("../config");
var Waterline = require("waterline");
var IO = require("./io.js");
var Swagger = require("./swagger.js");
var events = require("events");
var util = require("util");

function APP() {
  global.APP = this;
  this.config = config;
  this.io = new IO();
  this.swag = new Swagger();
}

util.inherits(APP, events.EventEmitter);

APP.prototype.initialize = function() {
  console.log("Initializing...");
  // Load services
  console.log("Loading services...");
  var services = require("../services");
  return Q.nfcall(async.parallel, services).then(function(results) {
    console.log("Services loaded !")
    _.extend(global, results);
    this.services = results;

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
        var k = S(key).camelize().s;
        k = k.charAt(0).toUpperCase() + k.slice(1);
        result[k] = value;
      });
      _.extend(global, collections);
      this.models = collections;
      this.connections = models.connections;
      this.orm = orm;

      // Load app
      console.log("Loading express app...");
      this.app = require("./app.js")(api);
      console.log("Express app loaded !");

      // HTTP Server
      this.server = require("http").Server(this.app);

      // Socket.io config
      this.io.addServer(this.server);
      this.emit("initialized");
    }.bind(this));
  }.bind(this));
};

APP.prototype.stop = function() {
  if (!this.orm) return Q();
  return Q.ninvoke(this.orm, "teardown");
};

APP.prototype.dbEvent = function(Model, evt, data, user) {
  this.emit("DBEvent", Model, evt, data, user);
};

module.exports = new APP();
