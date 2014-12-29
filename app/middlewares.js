var passport = require("passport");
var BearerStrategy = require('passport-http-bearer').Strategy;
var formidable = require("formidable");
var morgan = require("morgan");
var async = require("async");
var _ = require("lodash");

module.exports = function(app) {
  // Passport config

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

  // Express config

  if (app.get("env") === 'production') {
    app.set("trust proxy", "loopback");
    app.use(morgan("combined"));
  } else if (app.get("env") === "test") {
    app.set("trust proxy");
  } else {
    app.set("trust proxy");
    app.set("json spaces", 2);
    app.use(morgan("dev"));
  }

  app.use(require("cors")());
  app.use(require("compression")());
  app.use(function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
      if (err) return next(err);
      req.body = fields;
      req.files = files;
      req.form = form;

      res.on("finish", function() {
        var tasks = _.map(files, function(file) {
          return function(cb) {
            fs.exists(file.path, function(exists) {
              if (!exists) return cb();
              fs.remove(file.path, function(err) {
                if (err) return cb(err);
                cb();
              });
            });
          }
        });

        async.parallel(tasks);
      });

      next();
    });
  });
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
};
