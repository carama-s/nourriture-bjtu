function policyWrapper(fn) {
  return function(req, res, next) {
    fn(req, res, function(allow) {
      if (allow) {
        return next();
      } else {
        return res.status(403).json({error: "Forbidden"});
      }
    });
  }
}

module.exports = {
  policyWrapper: policyWrapper,
  isAuthenticated: policyWrapper(function(req, res, cb) { return cb(Boolean(req.user)); }),
  isSuperAdmin: policyWrapper(function(req, res, cb) { return cb(Boolean(req.user && (req.user.admin <= 0))) })
};
