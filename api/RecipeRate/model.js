module.exports = {
  connection: "default",
  identity: "recipe_rate",

  attributes: {
    user: {
      model: "user"
    },
    recipe: {
      model: "recipe",
      required: true
    },
    rate: {
      type: "integer",
      required: true,
      max: 5,
      min: 1
    }
  },

  toPopulate: []
};
