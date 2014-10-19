module.exports = function(req, res, next) {
  if (req.user) return next();
  res.send(403, {message: "You are not permitted to perform this action."});
};
