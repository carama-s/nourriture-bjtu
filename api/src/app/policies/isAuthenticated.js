module.exports = function(req, res, next) {
  if (req.user) return next();
  return res.status(403).json({error: 'Forbidden'});
};
