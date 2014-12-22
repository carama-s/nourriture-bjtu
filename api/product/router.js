var express = require("express");
var Product = require("./model.js");
var common = require("common");

var router = express.Router();

var rest = common.rest(Product);

router.route("/count")
  .get(rest.count);

router.route("/")
  .get(rest.find)
  .post(common.policies.isAuthenticated, rest.create);

router.route("/:oid")
  .get(rest.findOne)
  .put(common.policies.isSuperAdmin, rest.updateOne)
  .delete(common.policies.isSuperAdmin, rest.removeOne);

module.exports = router;
