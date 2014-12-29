module.exports = function(cb) {
  cb(null, function(res, next) {
    return function(err) {
      if (err && err.code == 'E_VALIDATION') return res.status(400).json(err);
      next(err);
    }
  });
};
