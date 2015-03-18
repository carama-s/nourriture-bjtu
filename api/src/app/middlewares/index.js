var passport = require("passport");
var BearerStrategy = require('passport-http-bearer').Strategy;
var morgan = require("morgan");

module.exports = {
  before: function(app) {
    // Passport config

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findOneById(id).then(function(user) {
        done(null, user);
      }, done);
    });

    passport.use(new BearerStrategy(function(accessToken, done) {
      Token.findOneByToken(accessToken).populate("user").then(function(token) {
        if (!token) return done(null, undefined);
        if (token.stillValid() && token.user) {
          token.updateAccess().then();
          return done(null, token.user);
        }
        token.destroy().then();
        return done(null, undefined);
      })
      .then(null, done);
    }));

    // Express config

    if (app.get("env") === 'production') {
      app.set("trust proxy", "loopback");
      app.use(morgan("short"));
    } else if (app.get("env") === "test") {
      app.set("trust proxy");
    } else {
      app.set("trust proxy");
      app.set("json spaces", 2);
      app.use(morgan("dev"));
    }

    app.use(require("cors")(APP.config.http.cors));
    app.use(require("compression")());
    app.use(require("./formidable"));
    app.use(passport.initialize());

    app.use(function(req, res, next) {
      passport.authenticate('bearer', {session: false}, function(err, user) {
        if (err) return next(err);
        if (!user) return next();
        req.logIn(user, function(err) {
          if (err) return next(err);
          next();
        });
      })(req, res);
    });

    return app;
  },

  after: function(app) {
    if (app.get("env") === 'development') {
      app.use(require("errorhandler")());
    }
    return app;
  }
};
