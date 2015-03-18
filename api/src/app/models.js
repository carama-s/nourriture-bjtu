var Waterline = require("waterline");

module.exports = function(api) {
  var models = {};

  _.forOwn(api, function(value, key) {
    model = value.model;
    if (model === undefined) return;
    models[key] = Waterline.Collection.extend(model);
  });

  return models;
};
