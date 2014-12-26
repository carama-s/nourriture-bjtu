var events = require("events");
var util = require("util");

function IO() {}

util.inherits(IO, events.EventEmitter);

IO.prototype.addServer = function(server) {
  var io = require("socket.io")(server);

  io.on("connection", function(socket) {
    socket.on("subscribe", function(data) {
      if (data.names != undefined) {
        _.each(data.names, function(name) {
          socket.join(name);
        });
      }
    });

    socket.on("unsubscribe", function(data) {
      if (data.names != undefined) {
        _.each(data.names, function(name) {
          socket.leave(name);
        });
      }
    });
  });

  this.on("DBEvent", function(name, data) {
    io.to(name).emit(name, data);
  });
};

IO.prototype.dbEvent = function(name, data) {
  this.emit("DBEvent", name, data);
};

IO.prototype.getHandler = function(model, name) {
  var io = this;
  var wasNewAdded = false;
  var h = {};

  function addWasNew() {
    if (wasNewAdded === false) {
      wasNewAdded = true;
      model.pre("save", function(next) {
        this._wasNew = this.isNew;
        next();
      });
    }
  };

  h.postNew = function() {
    addWasNew();
    model.post("save", function() {
      if (this._wasNew) io.dbEvent(name + ".new", this);
    });
    return h;
  };

  h.postUpdate = function() {
    addWasNew();
    model.post("save", function() {
      if (!this._wasNew) io.dbEvent(name + ".update", this);
    });
    return h;
  };

  h.postRemove = function() {
    model.post("remove", function() {
      io.dbEvent(name + ".remove", this);
    });
    return h;
  };

  return h;
};

module.exports = new IO();
