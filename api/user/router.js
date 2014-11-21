var crypto = require("crypto");
var uuid = require("node-uuid");
var express = require("express");
var User = require("./model.js");

var router = express.Router();

router.route("/get_token")
  .post(function(req, res, next) {
    if (req.body.email && req.body.passwd) {
      User.findOne({email: req.body.email})
      .exec(function(err, user) {
        if (err) return next(err);
        if (!user) {
          res.status(400).json({error: "Invalid credentials. User doesn't exists."});
        } else {
          user.checkPasswd(req.body.passwd, function(err, ok) {
            if (err) return next(err);
            if (!ok) {
              res.status(400).json({error: "Invalid credentials. Wrong password."});
            } else if (user.tokens.length > 0) {
              res.json({token: user.tokens[0].token});
            } else {
              var shasum = crypto.createHash("sha256");
              shasum.update(uuid.v1());
              var token = {token: shasum.digest("hex")};
              user.tokens.push(token);
              user.save(function(err, user) {
                if (err) return next(err);
                res.json(token);
              });
            }
          });
        }
      });
    } else {
      res.status(400).json({error: "Missing parameters."});
    }
  });

router.route("/")
  .get(common.rest.find(User))
  .post(common.rest.create(User));

router.route("/:oid")
  .get(common.rest.findOne(User))
  .put(common.rest.updateOne(User))
  .delete(common.rest.removeOne(User));

module.exports = router;
