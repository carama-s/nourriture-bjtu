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
                } else {
                  res.json({token: user.token.token, user: user});
                }
              });
          }
        })
        .then(null, next);
    } else {
      res.status(400).json({error: "Missing data"});
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

router.route("/change_passwd")
  .post(common.policies.isAuthenticated, function(req, res, next) {
    if (req.body.old_passwd && req.body.new_passwd) {
      req.user.checkPasswd(req.body.old_passwd)
        .then(function(ok) {
          if (!ok) return res.status(400).json({error: "Invalid credentials."});
          var d = Q.defer();
          req.user.passwd = req.body.new_passwd;
          req.user.save(function(err, u) {
            if (err && err.name == "ValidationError") return res.status(400).json(err);
            if (err) return d.reject(err);
            res.json(u);
            d.resolve();
          });
          return d.promise;
        })
        .then(null, next);
    } else {
      res.status(400).json({error: "Missing data"});
    }
  });

router.route("/update")
  .post(common.policies.isAuthenticated, function(req, res, next) {
    var data = _.pick(req.body, "firstname", "lastname", "gender");
    _.extend(req.user, data);
    req.user.save(function(err, u) {
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
