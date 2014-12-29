var events = require("events");
var util = require("util");

function IO(path) {
  this._path = path;
}

util.inherits(IO, events.EventEmitter);

IO.prototype.addServer = function(server) {
  var io = require("socket.io")(server, {
    path: this._path
  });

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

IO.prototype.handler = function(Model) {
  var ident = Model.identity;
  var io = this;

  return {
    create: function(data) {
      io.dbEvent(ident + ".create", data);
    },
    update: function(data) {
      io.dbEvent(ident + ".update", data);
    },
    destroy: function(data) {
      io.dbEvent(ident + ".destroy", data);
    }
  };
};

module.exports = IO;
