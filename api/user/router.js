var express = require("express");
var User = require("./model.js");

var router = express.Router();

router.route("/get_token")
  .post(function(req, res, next) {
    if (req.body.email && req.body.passwd) {
      User.findOne({email: req.body.email}).exec()
        .then(function(user) {
          if (!user) {
            res.status(400).json({error: "Invalid credentials."});
          } else {
            return user.checkPasswd(req.body.passwd)
              .then(function(ok) {
                if (!ok) {
                  res.status(400).json({error: "Invalid credentials."});
                } else if (user.tokens.length > 0) {
                  res.json({token: user.tokens[0].token, user: user});
                } else {
                  var token = User.generateToken();
                  var d = Q.defer();
                  user.tokens.push({token: token});
                  user.save(function(err) {
                    if (err) return d.reject(err);
                    res.json({token: token, user: user});
                    d.resolve();
                  });
                  return d.promise;
                }
              });
          }
        })
        .then(null, next);
    }
  });

router.route("/signup")
  .post(function(req, res, next) {
    var data = _.omit(req.body, "tokens", "admin");
    var user = new User(data);
    user.save(function(err, u) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      res.json(u);
    });
  });

router.route("/update")
  .post(common.policies.isAuthenticated, function(req, res, next) {
    var data = _.pick(req.body, "passwd");
    _.extend(req.user, data);
    user.save(function(err, u) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      res.json(u);
    });
  });

router.route("/me")
  .get(common.policies.isAuthenticated, function(req, res, next) {
    res.json(req.user);
  });

router.route("/")
  .get(common.rest.find(User))
  .post(common.policies.isSuperAdmin, common.rest.create(User));

router.route("/:oid")
  .get(common.rest.findOne(User))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(User))
  .delete(common.policies.isSuperAdmin, common.rest.removeOne(User));

module.exports = router;
