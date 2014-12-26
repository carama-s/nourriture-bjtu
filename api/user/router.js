var express = require("express");
var User = require("./model.js");
var common = require("common");
var FB = require("fb.js");

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
    } else if (req.body.facebook_id && req.body.facebook_token) {
      var fb_id = req.body.facebook_id;
      var fb_token = req.body.facebook_token;
      FB.getDebugToken(fb_token)
        .then(function(fbres) {
          if (fbres == null) return res.status(400).json({error: "Invalid credentials."});
          if (fbres.user_id != fb_id) return res.status(400).json({error: "Invalid credentials."});
          return User.findOne({facebook_id: fb_id}).exec()
            .then(function(user) {
              if (user != null) return res.json({token: user.token.token, user: user});
              return FB.apiGet("/" + fb_id)
                .then(function(fbres) {
                  var user = _.pick(fbres.body, "email", "gender");
                  user.firstname = fbres.body.first_name;
                  user.lastname = fbres.body.last_name;
                  user.facebook_id = fbres.body.id;
                  user.facebook_token = fb_token;
                  return res.json({need_signup: true, user: user});
                });
            });
        })
        .then(null, next);
    } else {
      res.status(400).json({error: "Missing data"});
    }
  });

router.route("/signup")
  .post(function(req, res, next) {
    function create_user(data) {
      var user = new User(data);
      user.save(function(err, u) {
        if (err && err.name == "ValidationError") return res.status(400).json(err);
        if (err) return next(err);
        res.json(u);
      });
    }

    var fb_id = req.body.facebook_id;
    var fb_token = req.body.facebook_token;
    var data = _.omit(req.body, "tokens", "admin", "facebook_id");

    if (fb_token === undefined && fb_id === undefined) return create_user(data);

    FB.getDebugToken(fb_token)
      .then(function(fbres) {
        if (fbres == null) return res.status(400).json({error: "Can't valid facebook_token"});
        if (fbres.user_id != fb_id) return res.status(400).json({error: "Can't valid facebook_id"});
        data.facebook_id = fb_id;
        create_user(data);
      }, next);
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
