function makeSimpleValidationError(errors) {
  var err = {
    error: "E_VALIDATION",
    status: 400,
    invalidAttributes: {}
  };
  _.forOwn(errors, function(e, k) {
    err.invalidAttributes[k] = _.map(e, function(v) {return {rule: v}});
  });
  return err;
}

module.exports = function(cb) {
  cb(null, function(res, next) {
    return function(err) {
      if (!err) return next();
      if (err.code == 'E_VALIDATION') return res.status(400).json(err);
      if (err.code == "E_UNKNOWN" && err.originalError) {
        var ori = err.originalError;
        if (ori.name == "MongoError" && ori.code == 11000) {
          var line = ori.err.split(" ");
          var field = _.last(line[line.indexOf("index:") + 1].split(".")).slice(1, -2);
          var data = {};
          data[field] = ["unique"];
          return res.status(400).json(makeSimpleValidationError(data));
        }
      }
      next(err);
    }
  });
};
