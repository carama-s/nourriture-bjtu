module.exports = function(req, res, next) {
  if (req.user && req.user.admin <= 0) return next();
  return res.forbidden('You are not permitted to perform this action.');
};
