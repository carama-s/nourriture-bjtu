validObjectid = require("valid-objectid").isValid;

function find(model) {
  return function(req, res, next) {
    var query = common.qsToFind(model.find(), req.query);
    query.exec(function(err, entries) {
      if (err) return next(err);
      res.json(entries);
    });
  };
}

function create(model) {
  return function(req, res, next) {
    model.create(req.body, function(err, entry) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      res.json(entry);
    });
  };
}

function findOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    model.findById(req.params.oid, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      res.json(entry);
    });
  };
}

function updateOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    model.findByIdAndUpdate(req.params.oid, req.body, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      res.json(entry);
    });
  };
}

function removeOne(model) {
  return function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    model.findByIdAndRemove(req.params.oid, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      res.json(entry);
    });
  };
}

module.exports = {
  find: find,
  create: create,
  findOne: findOne,
  updateOne: updateOne,
  removeOne: removeOne
};
