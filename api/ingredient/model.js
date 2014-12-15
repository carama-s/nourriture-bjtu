var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var Q = require("q");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Ingredient = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: [String],
  photo: {
    type: ObjectId,
    ref: 'GridFile'
  },
  description: String,
  category: {
    type: String,
    enum: ["chocolate", "spice", "cheese", "bread", "egg", "fruit", "vegetable", "other"],
    default: "other"
  },
  cooking_tips: String,
  allergy: [String]
});

Ingredient.methods.changePhoto = function(new_photo) {
  var d = Q.defer();
  if (this.photo !== undefined) {
    this.populate("photo", function(err, tmp) {
      if (err) return d.reject(err);
      tmp.photo.remove(function(err) {
        if (err) return d.reject(err);
        tmp.photo = new_photo;
        d.resolve();
      });
    });
  } else {
    this.photo = new_photo;
    setImmediate(d.resolve);
  }
  return d.promise;
};

Ingredient.pre("remove", function(next) {
  if (this.photo === undefined) return next();
  this.photo.remove(function(err) {
    if (err) return next(err);
    next();
  });
});

module.exports = mongoose.model("Ingredient", Ingredient);
