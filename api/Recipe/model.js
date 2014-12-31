var PHOTO_URI = "/recipe/";

var CATEGORIES = require("./categories.json");

module.exports = {

  connection: "default",
  identity: "recipe",

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
      defaultsTo: "other",
      required: true
    },
    servings: {
      type: "integer",
      required: true
    },
    preparation_time: {
      type: "integer",
      required: true
    },
    cooking_time: {
      type: "integer",
      required: true
    },
    ingredients: {
      collection: 'ingredient',
      via: 'recipes',
      dominant: true
    },
    directions: "array",

    toJSON: function() {
      var obj = this.toObject();
      if (obj.photo && obj.photo.uri && !obj.photo_url) obj.photo_url = obj.photo.uri();
      return obj;
    }
  },

  afterDestroy: function(ings, next) {
    Upload.destroy({id: _.pluck(ings, 'photo')}).exec(next);
  },

  toPopulate: ["photo", "ingredients"],

  CATEGORIES: CATEGORIES,
  PHOTO_URI: PHOTO_URI,
};
