function updateRecipeMeanRate(recipe) {
  return RecipeComment.find({recipe: recipe}).then(function(coms) {
    var nb = coms.length;
    var mean = 0;
    if (nb > 0) {
      mean = _.reduce(coms, function(acc, val) {
        return acc + val.rate;
      }, 0) / nb;
    }
    return Recipe.update(recipe, {rate: mean, nb_rates: nb});
  });
}

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
    },
    rate: {
      type: "integer",
      required: true,
      max: 5,
      min: 1
    }
  },

  afterCreate: function(com, next) {
    updateRecipeMeanRate(com.recipe).then(function() {
      next();
    }, next);
  },

  afterUpdate: function(com, next) {
    updateRecipeMeanRate(com.recipe).then(function() {
      next();
    }, next);
  },

  afterDestroy: function(coms, next) {
    var actions = _(coms).pluck("recipe").uniq().map(function(recipe_id) {
      return updateRecipeMeanRate(recipe_id);
    }).value();
    Q.all(actions).then(function() {
      next();
    }, next);
  },

  toPopulate: ["user"]
};
