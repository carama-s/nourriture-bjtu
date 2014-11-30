var mongoose = require("mongoose");
var validate = require("mongoose-validator");

var recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true
    },
    quantity: {
      type: Number,
      min: 0,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  steps: [String],
  persons: {
    type: Number,
    min: 0,
    required: true
  },
  kind: {
    type: String,
    required: true
  },
  tags: [String],
  times: [{
    kind: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    }
  }]
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
