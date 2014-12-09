var express = require("express");
var Recipe = require("./model.js");

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

router.route("/")
  .get(common.rest.find(Recipe))
  .post(common.policies.isSuperAdmin, common.rest.create(Recipe));

router.route("/:oid")
  .get(common.rest.findOne(Recipe))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(Recipe))
  .delete(common.policies.isSuperAdmin, common.rest.removeOne(Recipe));

module.exports = router;
