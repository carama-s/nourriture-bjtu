var express = require("express");
var Product = require("./model.js");

var router = express.Router();

router.route("/")
  .get(common.rest.find(Product))
  .post(common.policies.isAuthenticated, common.rest.create(Product));

router.route("/:oid")
  .get(common.rest.findOne(Product))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(Product))
  .delete(common.policies.isSuperAdmin, common.rest.removeOne(Product));

module.exports = router;
