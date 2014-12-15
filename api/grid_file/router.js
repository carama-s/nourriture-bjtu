var express = require("express");
var GridFile = require("./model.js");

var router = express.Router();

router.get("*", function(req, res, next) {
  GridFile.findOne({path: req.url}).exec()
    .then(function(file) {
      if (file == null) return next("route");
      file.createReadStream().pipe(res);
    }, next);
});

module.exports = router;
