module.exports = {
  connection: "default",
  identity: "recipe_comment",

  attributes: {
    user: {
      model: "user"
    },
    recipe: {
      model: "recipe",
      required: true
    },
    comment: {
      type: "text",
      required: true
    }
  },

  toPopulate: []
};
