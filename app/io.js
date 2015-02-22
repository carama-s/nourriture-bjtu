function IO() {}

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

  APP.on("DBEvent", function(Model, evt, data) {
    var name = Model.identity + "." + evt;
    io.to(name).emit(name, data);
  });
};

module.exports = IO;
