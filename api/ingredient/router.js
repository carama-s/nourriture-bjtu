var express = require("express");
var Ingredient = require("./model.js");

var router = express.Router();

router.route("/")
  .get(common.rest.find(Ingredient))
  .post(common.policies.isAuthenticated, common.rest.create(Ingredient));

router.route("/:oid")
  .get(common.rest.findOne(Ingredient))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(Ingredient))
  .delete(common.policies.isSuperAdmin, common.rest.removeOne(Ingredient));

module.exports = router;
