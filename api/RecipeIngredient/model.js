module.exports = {
  connection: "default",
  identity: "recipe_ingredient",

  attributes: {
    ingredient: {
      model: "ingredient",
      required: true
    },
    recipe: {
      model: "recipe",
      required: true
    },
    quantity: {
      type: "string",
      required: true
    }
  },

  toPopulate: []
};
