var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var Q = require("q");
var fs = require("fs-extra");
var path = require("path");
var categories = require("./categories");
var io = require("io.js");

var PHOTO_DIR = path.join(__rootDir, "uploads", "ingredient");
var PHOTO_URI = "/uploads/ingredient/";

var Ingredient = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: [String],
  photo_name: String,
  description: String,
  category: {
    type: String,
    enum: _.map(categories, function(cat) {return cat.value;}),
    default: "other"
  },
  cooking_tips: String,
  allergy: [String],
  period: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
});

Ingredient.virtual("photo_path").get(function() {
  if (this.photo_name === undefined) return undefined;
  return PHOTO_DIR + this.photo_name;
});

Ingredient.virtual("photo_url").get(function() {
  if (this.photo_name === undefined) return undefined;
  return PHOTO_URI + this.photo_name;
});

Ingredient.methods.changePhoto = function(new_photo_name) {
  if (this.photo_name === undefined) {
    this.photo_name = new_photo_name;
    return Q();
  }
  var d = Q.defer();
  fs.remove(this.photo_path, function(err) {
    if (err) return d.reject(err);
    this.photo_name = new_photo_name;
    return d.resolve();
  }.bind(this));
  return d.promise;
};

Ingredient.pre("remove", function(next) {
  if (this.photo_name === undefined) return next();
  fs.remove(this.photo_path, function(err) {
    return next(err);
  });
});

io.getHandler(Ingredient, "ingredient").postNew().postUpdate().postRemove();

if (!Ingredient.options.toJSON) Ingredient.options.toJSON = {};
Ingredient.options.toJSON.virtuals = true;
Ingredient.options.toJSON.transform = function(doc, ret, opts) {
  delete ret.photo_name;
  delete ret.photo_path;
};

module.exports = mongoose.model("Ingredient", Ingredient);
module.exports.PHOTO_DIR = PHOTO_DIR
module.exports.PHOTO_URI = PHOTO_URI
