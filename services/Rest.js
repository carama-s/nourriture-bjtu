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
        if (sort) query = query.sort(sort);
        if (limit) query = query.limit(limit);
        if (skip) query = query.skip(skip);
        query.then(function(entries) {
          res.json(entries);
        }, next);
      },

      "findOne": function(req, res, next) {
        Model.findOneById(req.params.id).then(function(entry) {
          if (!entry) return next("route");
          res.json(entry);
        }, next);
      },

      "create": function(req, res, next) {
        Model.create(req.body).then(function(entry) {
          res.json(entry);
        }, function(err) {
          if (err.code == 'E_VALIDATION') return res.status(400).json(err);
          next(err);
        });
      },

      "update": function(req, res, next) {
        Model.findById(req.params.id).then(function(entry) {
          if (!entry) return next("route");
          _.extend(model, req.body);
          return model.save().then(function(entry) {
            res.json(entry);
          }, function(err) {
            if (err.code == 'E_VALIDATION') return res.status(400).json(err);
            next(err);
          });
        }, next);
      },

      "destroy": function(req, res, next) {
        Model.destroy(req.params.id).then(function(entry) {
          res.json(entry);
        }, next);
      },

      "count": function(req, res, next) {
        var parser = ReqParser(req);
        var criteria = parser.criteria();
        var query = Model.find();
        if (criteria) query = query.where(criteria);
        query.count().then(function(count) {
          res.json({count: count});
        }, next);
      }
    }
  });
};
