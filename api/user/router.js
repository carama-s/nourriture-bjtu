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
    var data = _.pick(req.body, "firstname", "lastname", "gender", "email");
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

var rest = common.rest(User);

router.route("/count")
  .get(rest.count);

router.route("/")
  .get(rest.find)
  .post(common.policies.isSuperAdmin, rest.create);

router.route("/:oid")
  .get(rest.findOne)
  .put(common.policies.isSuperAdmin, rest.updateOne)
  .delete(common.policies.isSuperAdmin, rest.removeOne);

module.exports = router;
