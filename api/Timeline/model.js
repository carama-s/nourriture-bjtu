module.exports = {

  connection: "default",
  identity: "timeline",
  schema: false,

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
      type: "json"
    }
  },

  toPopulate: ["user"]
};
