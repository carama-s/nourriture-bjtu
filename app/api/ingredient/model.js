var mongoose = require("mongoose");
var validate = require("mongoose-validator");

var ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

var Ingredient = mongoose.model("Ingredient", userIngredient);

module.exports = Ingredient;
