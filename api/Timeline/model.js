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
    data: {
      type: "json"
    },
    destroyed: {
      type: "boolean",
      defaultsTo: false
    }
  },

  beforeCreate: function(values, next) {
    if (values.name != "destroy" || data == undefined || data.id == undefined) return next();
    values.destroyed = true;
    Timeline.update({"data.id": values.data.id}, {destroyed: true}).then(function(res) {
      next();
    }, next);
  },

  toPopulate: ["user"]
};
