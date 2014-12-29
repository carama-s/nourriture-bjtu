function runserver(args) {
  var config = require("../config");

  var argv = require("yargs")(args)
    .options("p", {
      alias: "port",
      default: process.env.PORT || config.http.port,
      requiresArg: true
    })
    .argv;

  var app = require("../app");

  app.initialize().then(function() {
    console.log("Starting HTTP server...");
    app.server.listen(argv.p, function() {
      console.log("HTTP server started on port %d !", argv.p);
      console.log();
    });
  }, function(err) {
    console.trace(err);
    process.exit(1);
  });
}

module.exports = {
  fn: runserver,
  desc: "Run the HTTP server"
};
