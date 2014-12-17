validObjectid = require("valid-objectid").isValid;

function count(model) {
  return function(req, res, next) {
    common.qsToFind(model.find(), req.query).count().exec().then(function(nb) {
      res.json({count: nb});
    }, next);
  };
}

function find(model) {
  return function(req, res, next) {
    common.qsToFind(model.find(), req.query).exec().then(res.json.bind(res), next);
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
    model.findById(req.params.oid, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      _.extend(entry, req.body);
      entry.save(function(err, data) {
        if (err && err.name == "ValidationError") return res.status(400).json(err);
        if (err) return next(err);
        res.json(data);
      });
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
  removeOne: removeOne,
  count: count
};
