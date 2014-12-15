function runserver(args) {
  var config = require("../config");
  var mongoose = require("mongoose");
  var Grid = require("gridfs-stream");

  var argv = require("yargs")(args)
    .options("p", {
      alias: "port",
      default: process.env.PORT || config.http.port,
      requiresArg: true
    })
    .argv;

  var db = mongoose.connection;
  var app = require("../app.js");

  db.on("error", function(err) {
    console.log("Error connection to MongoDB:", err);
  });

  db.once("open", function() {
    if (global.gfs == undefined) {
      global.gfs = Grid(db.db, mongoose.mongo);
    }
    console.log("Connected to MongoDB !");
    console.log();
    console.log("Starting HTTP server...");
    app.listen(argv.p, function() {
      console.log("HTTP server started on port %d !", argv.p);
      console.log();
    });
  });
  console.log("Connecting to MongoDB...");
  mongoose.connect(config.mongoose.uri);
}

module.exports = {
  fn: runserver,
  desc: "Run the HTTP server"
};
