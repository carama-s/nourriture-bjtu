var PHOTO_URI = "/ingredient/";

var CATEGORIES = require("./categories.json");

module.exports = {

  connection: "default",
  identity: "ingredient",

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
    recipes: {
      collection: 'recipe',
      via: 'ingredients'
    },
    nutritions: {
      type: "array"
    },

    toJSON: function() {
      var obj = this.toObject();
      if (obj.photo && obj.photo.uri && !obj.photo_url) obj.photo_url = obj.photo.uri();
      return obj;
    }
  },

  afterDestroy: function(ings, next) {
    Upload.destroy({id: _.pluck(ings, 'photo')}).exec(next);
  },

  toPopulate: ["photo"],

  CATEGORIES: CATEGORIES,
  PHOTO_URI: PHOTO_URI,
};
