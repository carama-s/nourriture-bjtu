module.exports = function(cb) {
  cb(null, function(Model) {
    return {
      "find": function(req, res, next) {
        var parser = ReqParser(req);
        var criteria = parser.criteria();
        var sort = parser.sort();
        var limit = parser.limit();
        var skip = parser.skip();
        var query = Model.find();
        if (criteria) query = query.where(criteria);
        if (limit) query = query.limit(limit);
        if (skip) query = query.skip(skip);
        if (sort) query = query.sort(sort);
        if (Model.toPopulate) {
          _.each(Model.toPopulate, function(field) {
            query = query.populate(field);
          });
        }
        query.then(function(entries) {
          res.json(entries);
        }, next);
      },

      "swagFind": function(swag, id, schema) {
        swag("/", {
          "get": {
            "operationId": id,
            "parameters": [{
              "name": "where",
              "in": "formData",
              "type": "string"
            }, {
              "name": "limit",
              "in": "formData",
              "type": "integer"
            }, {
              "name": "skip",
              "in": "formData",
              "type": "integer"
            }, {
              "name": "sort",
              "in": "formData",
              "type": "string"
            }],
            "responses": {
              "400": {"schema": {"$ref": "#/definitions/error"}},
              "200": {
                "type": "array",
                "items": {"$ref": schema}
              }
            }
          }
        });
      },

      "findOne": function(req, res, next) {
        var query = Model.findOneById(req.params.id);
        if (Model.toPopulate) {
          _.each(Model.toPopulate, function(field) {
            query = query.populate(field);
          });
        }
        query.then(function(entry) {
          if (!entry) return next("route");
          res.json(entry);
        }, next);
      },

      "swagFindOne": function(swag, id, schema) {
        swag("/{id}", {
          "get": {
            "operationId": id,
            "parameters": [{
              "name": "id",
              "in": "path",
              "required": true,
              "type": "string"
            }],
            "responses": {
              "400": {"schema": {"$ref": "#/definitions/error"}},
              "200": {"schema": {"$ref": schema}}
            }
          }
        });
      },

      "create": function(req, res, next) {
        Model.create(req.body).then(function(entry) {
          APP.dbEvent(Model, "create", entry);
          res.json(entry);
        }, function(err) {
          if (err.code == 'E_VALIDATION') return res.status(400).json(err);
          next(err);
        });
      },

      "update": function(req, res, next) {
        var query = Model.findById(req.params.id);
        if (Model.toPopulate) {
          _.each(Model.toPopulate, function(field) {
            query = query.populate(field);
          });
        }
        query.then(function(entry) {
          if (!entry) return next("route");
          _.extend(model, req.body);
          return model.save().then(function(entry) {
            APP.dbEvent(Model, "update", entry);
            res.json(entry);
          }, function(err) {
            if (err.code == 'E_VALIDATION') return res.status(400).json(err);
            next(err);
          });
        }, next);
      },

      "destroy": function(req, res, next) {
        Model.destroy(req.params.id).then(function(entry) {
          APP.dbEvent(Model, "destroy", entry);
          res.json(entry);
        }, next);
      },

      "count": function(req, res, next) {
        var parser = ReqParser(req);
        var criteria = parser.criteria();
        Model.count(criteria).then(function(count) {
          res.json({count: count});
        }, next);
      },

      "swagCount": function(swag, id) {
        swag("/count", {
          "get": {
            "operationId": id,
            "parameters": [{
              "name": "where",
              "in": "formData",
              "type": "string"
            }],
            "responses": {
              "200": {
                "properties": {
                  "count": {"type": "integer"}
                }
              }
            }
          }
        });
      },
    }
  });
};
