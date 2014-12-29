module.exports = function(req, res, next) {
  if (req.user && req.user.admin <= 0) return next();
  return res.status(403).send('Forbidden');
};
