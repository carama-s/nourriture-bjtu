var express = require("express");
var User = require("./model.js");

var router = express.Router();

router.route("/")
  .get(common.rest.find(User))
  .post(common.rest.create(User));

router.route("/:oid")
  .get(common.rest.findOne(User))
  .put(common.rest.updateOne(User))
  .delete(common.rest.removeOne(User));

module.exports = router;
