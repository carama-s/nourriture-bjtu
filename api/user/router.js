var crypto = require("crypto");
var uuid = require("node-uuid");
var express = require("express");
var User = require("./model.js");

var router = express.Router();

router.route("/get_token")
  .post(function(req, res, next) {
    if (req.body.email && req.body.passwd) {
      User.findOne({email: req.body.email}).exec().then(function(user) {
        if (!user) {
          res.status(400).json({error: "Invalid credentials. User doesn't exists."});
        } else {
          return user.checkPasswd(req.body.passwd).then(function(ok) {
            if (!ok) {
              res.status(400).json({error: "Invalid credentials. Wrong password."});
            } else if (user.tokens.length > 0) {
              res.json({token: user.tokens[0].token});
            } else {
              var shasum = crypto.createHash("sha256");
              shasum.update(uuid.v1());
              var token = {token: shasum.digest("hex")};
              user.tokens.push(token);
              return Q.ninvoke(user, "save").then(function() {
                res.json(token);
              });
            }
          });
        }
      })
      .then(null, next);
    }
  });

router.route("/signup")
  .post(function(req, res, next) {
    var user = new User({
      username: req.body.username,
      passwd: req.body.passwd,
      email: req.body.email
    });
    Q.ninvoke(user, "save").then(res.json.bind(res), function(err) {
      if (err.name == "ValidationError") return res.status(400).json(err);
      next(err);
    });
  });

router.route("/")
  .get(common.rest.find(User))
  .post(common.policies.isSuperAdmin, common.rest.create(User));

router.route("/:oid")
  .get(common.rest.findOne(User))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(User))
  .delete(common.policies.isSuperAdmin, common.rest.removeOne(User));

module.exports = router;
