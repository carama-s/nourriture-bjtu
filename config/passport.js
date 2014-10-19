var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new BearerStrategy(function(accessToken, next) {
  Token.findOne({token: accessToken})
    .populate("user")
    .exec(function(err, token) {
      if (err) return next(err);
      if (!token) return next(null, undefined);
      return next(null, token.user);
    });
}));
