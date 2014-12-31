module.exports = {

  connection: "fast",
  identity: "timeline",

  attributes: {
    name: {
      type: "string",
      required: true
    },
    domain: {
      type: "string",
      required: "true"
    },
    user: {
      model: "user"
    },
    ingredient: {
      model: "ingredient"
    }
  },

  toPopulate: ["user", "ingredient"]
};
