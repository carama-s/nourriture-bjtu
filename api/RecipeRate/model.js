function updateRecipeMeanRate(recipe) {
  return RecipeRate.find({recipe: recipe}).then(function(rates) {
    var nb = rates.length;
    var mean = 0;
    if (nb > 0) {
      mean = _.reduce(rates, function(acc, val) {
        return acc + val.rate;
      }, 0) / nb;
    }
    return Recipe.update(recipe, {rate: mean, nb_rates: nb});
  });
}

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

  afterCreate: function(rate, next) {
    updateRecipeMeanRate(rate.recipe).then(function() {
      next();
    }, next);
  },

  afterUpdate: function(rate, next) {
    updateRecipeMeanRate(rate.recipe).then(function() {
      next();
    }, next);
  },

  afterDestroy: function(rates, next) {
    var actions = _(rates).pluck("recipe").uniq().map(function(recipe_id) {
      return updateRecipeMeanRate(recipe_id);
    }).value();
    Q.all(actions).then(function() {
      next();
    }, next);
  },

  toPopulate: []
};
