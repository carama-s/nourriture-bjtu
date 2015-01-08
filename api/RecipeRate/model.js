function updateRecipeMeanRate(recipe, next) {
  RecipeRate.find({recipe: recipe}).then(function(rates) {
    var nb = rates.length;
    var mean = 0;
    if (nb > 0) {
      mean = _.reduce(rates, function(acc, val) {
        return acc + val.rate;
      }, 0) / nb;
    }
    return Recipe.update(recipe, {rate: mean});
  })
  .then(null, next);
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
    updateRecipeMeanRate(rate.recipe, next);
  },

  afterUpdate: function(rate, next) {
    updateRecipeMeanRate(rate.recipe, next);
  },

  toPopulate: []
};
