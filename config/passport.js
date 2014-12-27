var passport = require("passport");
var BearerStrategy = require('passport-http-bearer').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOneById(id).then(function(user) {
    done(null, user);
  }, done);
});

passport.use(new BearerStrategy(function(accessToken, next) {
  Token.findOneByToken(accessToken).populate("user").then(function(token) {
    if (token) return next(null, token.user);
    return next(null, undefined);
  })
  .then(null, next);
}));
