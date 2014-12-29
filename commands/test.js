function test(args) {
  process.env.NODE_ENV = "test";
  var fs = require("fs");
  var path = require("path");
  var api = require("../api");
  var Mocha = require("mocha");
  var mocha = new Mocha;

  var keys = _.keys(api);

  async.each(keys, function(name, cb) {
    var filePath = path.join(__rootDir, "api", name, "_tests.js");
    fs.exists(filePath, function(exists) {
      if (!exists) return cb();
      mocha.addFile(filePath);
      cb();
    });
  }, function(err) {
    var app = require("../app");

    app.initialize().then(function() {
      mocha.run(function(failures) {
        process.on('exit', function () {
          process.exit(failures);
        });
      });
    });
  });
}

module.exports = {
  fn: test,
  desc: "Launch tests"
};
