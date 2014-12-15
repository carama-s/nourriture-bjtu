var mongoose = require("mongoose");
var validate = require("mongoose-validator");

var ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: [String],
  photo: {
    type: String
  },
  description: String,
  category: {
    type: String,
    enum: ["chocolate", "spice", "cheese", "bread", "egg", "fruit", "vegetable", "other"]
  },
  cooking_tips: String,
  allergy: [String]
});

var Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
