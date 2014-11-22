var express = require("express");
var Ingredient = require("./model.js");

var router = express.Router();

router.route("/")
  .get(common.rest.find(Ingredient))
  .post(common.rest.create(Ingredient));

router.route("/:oid")
  .get(common.rest.findOne(Ingredient))
  .put(common.rest.updateOne(Ingredient))
  .delete(common.rest.removeOne(Ingredient));

module.exports = router;
