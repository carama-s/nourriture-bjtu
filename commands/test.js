function test(args) {
  var fs = require("fs");
  var path = require("path");
  var api = require("../api");
  var Mocha = require("mocha");
  var mocha = new Mocha;

  for (name in api) {
    var filePath = path.join(__rootDir, "api", name, "_tests.js");
    if (fs.existsSync(filePath)) {
      mocha.addFile(filePath);
    }
  }

  mocha.run(function(failures){
    process.on('exit', function () {
      process.exit(failures);
    });
  });
}

module.exports = {
  fn: test,
  desc: "Launch tests"
};
