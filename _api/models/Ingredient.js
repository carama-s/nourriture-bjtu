/**
* Ingredient.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var path = require("path");

var PHOTO_URI = "/ingredient/";

var CATEGORIES = [
  {"name": "Bread", "value": "bread"},
  {"name": "Cheese", "value": "cheese"},
  {"name": "Chocolate", "value": "chocolate"},
  {"name": "Egg", "value": "egg"},
  {"name": "Fish", "value": "fish"},
  {"name": "Fruit", "value": "fruit"},
  {"name": "Meat", "value": "meat"},
  {"name": "Spice", "value": "spice"},
  {"name": "Vegetable", "value": "vegetable"},
  {"name": "Other", "value": "other"}
];

module.exports = {

  types: {
    period: function(p) {
      return p.length == 12;
    }
  },

  attributes: {
    name: {
      type: "string",
      required: true
    },
    tags: "array",
    photo: {
      model: "upload",
      unique: true
    },
    description: "text",
    category: {
      type: "string",
      enum: _.pluck(CATEGORIES, "value"),
      defaultsTo: "other"
    },
    cooking_tips: "text",
    allergy: "array",
    period: {
      type: "array",
      period: true,
      defaultsTo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },

    toJSON: function() {
      var obj = this.toObject();
      if (obj.photo) obj.photo_url = obj.photo.uri();
      return obj;
    }
  },

  afterDestroy: function(ings, next) {
    Upload.destroy({id: _.pluck(ings, 'photo')}).exec(next);
  },

  CATEGORIES: CATEGORIES,
  PHOTO_URI: PHOTO_URI,
};
