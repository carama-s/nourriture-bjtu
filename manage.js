#!/usr/bin/env node

if (require.main === module) {
  var yargs = require("yargs");

  function runserver(args) {
    var argv = yargs(args)
      .options("p", {
        alias: "port",
        default: process.env.PORT || 3000,
        requiresArg: true
      })
      .argv;
    var app = require("./app");
    console.log("Connecting to MongoDB...");
    app.db.on("error", function(err) {
      console.log("Error connection to MongoDB:", err);
    });

    app.db.once("open", function() {
      console.log("Connected to MongoDB !");
      console.log();
      console.log("Starting HTTP server...");
      app.app.listen(argv.p, function() {
        console.log("HTTP server started on port %d !", argv.p);
        console.log();
      });
    });
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
