var express = require("express");
var Ingredient = require("./model.js");
var multer = require("multer");

var router = express.Router();

router.route("/create")
  .post(common.policies.isAuthenticated, multer({
    dest: Ingredient.PHOTO_DIR,
    onFileUploadStart: function (file) {
      if (file.fieldname != "photo") return false;
      var mime_regex = /^image\//i;
      if (!mime_regex.test(file.mimetype)) return false;
    }
  }), function(req, res, next) {
    var data = _.omit(req.body, "photo_name");
    var ing = new Ingredient(data);
    ing.save(function(err, ing) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      var photo = req.files.photo
      if (photo === undefined) return res.json(ing);
      ing.changePhoto(photo.name)
        .then(function() {
          ing.save(function(err, ing) {
            if (err && err.name == "ValidationError") return res.status(400).json(err);
            if (err) return next(err);
            res.json(ing);
          });
        }, next);
    });
  });

router.route("/")
  .get(common.rest.find(Ingredient))
  .post(common.policies.isSuperAdmin, common.rest.create(Ingredient));

router.route("/:oid")
  .get(common.rest.findOne(Ingredient))
  .put(common.policies.isSuperAdmin, common.rest.updateOne(Ingredient))
  .delete(common.rest.removeOne(Ingredient));

module.exports = router;
