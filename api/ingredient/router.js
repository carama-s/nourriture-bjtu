var express = require("express");
var Ingredient = require("./model.js");
var multer = require("multer");

var router = express.Router();

var onFileUploadStart = function (file) {
  if (file.fieldname != "photo") return false;
  var mime_regex = /^image\//i;
  if (!mime_regex.test(file.mimetype)) return false;
};

function parseBodyData(data) {
  ["tags", "allergy", "period"].forEach(function(k) {
    if (data.hasOwnProperty(k)) {
      switch (typeof(data[k])) {
      case "array":
        break;
      case "string":
        try {
          data[k] = JSON.parse(data[k]);
        } catch(err) {
          data[k] = undefined;
        }
        break;
      default:
        data[k] = undefined;
      }
    }
  });
  return data;
}

router.route("/create")
  .post(common.policies.isAuthenticated, multer({
    dest: Ingredient.PHOTO_DIR,
    onFileUploadStart: onFileUploadStart
  }), function(req, res, next) {
    var data = _.omit(req.body, "photo_name");
    data = parseBodyData(data);
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

router.route("/:oid/update")
  .post(common.policies.isAuthenticated, multer({
    dest: Ingredient.PHOTO_DIR,
    onFileUploadStart: onFileUploadStart
  }), function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    Ingredient.findById(req.params.oid, function(err, ing) {
      if (err) return next(err);
      if (ing === null) return next("route");
      var data = _.omit(req.body, "photo_name");
      data = parseBodyData(data);
      _.extend(ing, data);
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
  });

var rest = common.rest(Ingredient);

router.route("/count")
  .get(rest.count);

router.route("/")
  .get(rest.find)
  .post(common.policies.isSuperAdmin, rest.create);

router.route("/:oid")
  .get(rest.findOne)
  .put(common.policies.isSuperAdmin, rest.updateOne)
  .delete(rest.removeOne);

module.exports = router;
