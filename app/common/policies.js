function policyWrapper(fn) {
  return function(req, res, next) {
    fn(req, res, function(allow) {
      if (allow) {
        return next();
      } else {
        return res.status(403).end();
      }
    });
  }
}

module.exports = {
  policyWrapper: policyWrapper,
  authenticated: policyWrapper(function(req, res, cb) { return cb(Boolean(req.user)); })
};
