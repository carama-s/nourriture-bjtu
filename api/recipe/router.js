var express = require("express");
var Recipe = require("./model.js");
var common = require("common");

var router = express.Router();

router.route("/add")
  .post(common.policies.isAuthenticated, function(req, res, next) {
    var data = _.omit(req.body, "creator");
    var recipe = Recipe(data);
    recipe.creator = req.user._id;
    recipe.save(function(err, r) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      res.json(r);
    });
  });

var rest = common.rest(Recipe);

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
