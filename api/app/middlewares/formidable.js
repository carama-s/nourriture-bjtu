var formidable = require("formidable");
var fs = require("fs-extra");

module.exports = function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    if (err) return next(err);
    req.body = fields;
    req.files = files;
    req.form = form;

    res.on("finish", function() {
      var tasks = _.map(files, function(file) {
        return function(cb) {
          fs.exists(file.path, function(exists) {
            if (!exists) return cb();
            fs.remove(file.path, function(err) {
              if (err) return cb(err);
              cb();
            });
          });
        }
      });

      async.parallel(tasks);
    });

    next();
  });
};
