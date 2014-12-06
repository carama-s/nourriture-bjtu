validObjectid = require("valid-objectid").isValid;

function find(model) {
  return function(req, res, next) {
    common.qsToFind(model.find(), req.query).exec().then(res.json.bind(res), next);
  };
}

function create(model) {
  return function(req, res, next) {
    Q.ninvoke(model, "create", req.body).then(res.json.bind(res), function(err) {
      if (err.name == "ValidationError") return res.status(400).json(err);
      next(err);
    });
  };
}

function findOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    Q.ninvoke(model, "findById", req.params.oid).then(function(entry) {
      if (entry === null) return next("route");
      res.json(entry);
    }, next);
  };
}

function updateOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    Q.ninvoke(model, "findById", req.params.oid).then(function(entry) {
      if (entry === null) return next("route");
      _.extend(entry, req.body);
      return Q.ninvoke(entry, "save").then(res.json.bind(res), function(err) {
        if (err.name == "ValidationError") return res.status(400).json(err);
        next(err);
      });
    }, next);
  };
}

function removeOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    Q.ninvoke(model, "findByIdAndRemove", req.params.oid).then(function(entry) {
      if (entry === null) return next("route");
      res.json(entry);
    }, next);
  };
}

module.exports = {
  find: find,
  create: create,
  findOne: findOne,
  updateOne: updateOne,
  removeOne: removeOne
};
