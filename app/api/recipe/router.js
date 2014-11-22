var express = require("express");
var Recipe = require("./model.js");

var router = express.Router();

router.route("/")
  .get(common.rest.find(Recipe))
  .post(common.rest.create(Recipe));

router.route("/:oid")
  .get(common.rest.findOne(Recipe))
  .put(common.rest.updateOne(Recipe))
  .delete(common.rest.removeOne(Recipe));

module.exports = router;
