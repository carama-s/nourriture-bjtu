#!/usr/bin/env node

if (require.main === module) {
  var yargs = require("yargs");
  var config = require("./config");

  function runserver(args) {
    var mongoose = require("mongoose");
    var argv = yargs(args)
      .options("p", {
        alias: "port",
        default: process.env.PORT || config.http.port,
        requiresArg: true
      })
      .argv;

    var db = mongoose.connection;
    var app = require("./app");

    db.on("error", function(err) {
      console.log("Error connection to MongoDB:", err);
    });

    db.once("open", function() {
      console.log("Connected to MongoDB !");
      console.log();
      console.log("Starting HTTP server...");
      app.app.listen(argv.p, function() {
        console.log("HTTP server started on port %d !", argv.p);
        console.log();
      });
    });

    console.log("Connecting to MongoDB...");
    mongoose.connect(config.mongoose.uri);
  }

  switch (process.argv[2]) {
    case "runserver":
      return runserver(process.argv.slice(3));
    case undefined:
      console.error("Provide a command please");
      process.exit(1);
    default:
      console.error("Command %s unknown", process.argv[2]);
  }
}
