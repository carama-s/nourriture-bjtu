function runserver(args) {
  var config = require("../config");
  var mongoose = require("mongoose");
  var FB = require("fb.js");

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
    console.log("Connected to MongoDB !");
    console.log();
    console.log("Connection to Facebook...");
    FB.getAccessToken(config.facebook.app_id, config.facebook.app_secret)
      .then(function(ok) {
        if (!ok) {
          console.error("Error connection to Facebook");
          process.exit(1);
        }
        console.log("Connected to Facebook !");
        console.log();
        console.log("Starting HTTP server...");
        app.listen(argv.p, function() {
          console.log("HTTP server started on port %d !", argv.p);
          console.log();
        });
      }, function(err) {
        console.error("Error connection to Facebook:", err);
        process.exit(1);
      });
  });
  console.log("Connecting to MongoDB...");
  mongoose.connect(config.mongoose.uri);
}

module.exports = {
  fn: runserver,
  desc: "Run the HTTP server"
};
