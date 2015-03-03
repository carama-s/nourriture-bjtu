function Swagger() {
  this.base_doc = APP.config.swagger;
  this.base_doc.paths = {};
  this.base_doc.definitions = {
    "error": {
      "properties": {
        "error": {"type": "string"}
      }
    }
  };
}

Swagger.prototype.addPath = function(path) {
  this.base_doc.paths = _.merge(this.base_doc.paths, path);
};

Swagger.prototype.addDefinition = function(def) {
  this.base_doc.definitions = _.merge(this.base_doc.definitions, def);
};

Swagger.prototype.handlerPaths = function(prefix, tags) {
  var swag = this;
  return function(path, data) {
    var tmp = {};
    for (key in data) {
      data[key].tags = tags;
    }
    tmp[prefix + path] = data;
    swag.addPath(tmp);
  };
};

Swagger.prototype.gen_api_doc = function() {
  return this.base_doc;
};

module.exports = Swagger;
