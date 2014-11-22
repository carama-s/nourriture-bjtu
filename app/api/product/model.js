var mongoose = require("mongoose");
var validate = require("mongoose-validator");

var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  quantity: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    },
    tags: [String]
  }
});

var Product = mongoose.model("Product", productSchema);

module.exports = Product;
