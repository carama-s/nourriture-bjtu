validObjectid = require("valid-objectid").isValid;

function rest(model) {
  var fn = {};

  fn.count = function(req, res, next) {
    common.qsToFind(model.find(), req.query).count().exec().then(function(nb) {
      res.json({count: nb});
    }, next);
  };

  fn.find = function(req, res, next) {
    common.qsToFind(model.find(), req.query).exec().then(res.json.bind(res), next);
  };

  fn.create = function(req, res, next) {
    model.create(req.body, function(err, entry) {
      if (err && err.name == "ValidationError") return res.status(400).json(err);
      if (err) return next(err);
      res.json(entry);
    });
  };

  fn.findOne = function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    model.findById(req.params.oid, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      res.json(entry);
    });
  };

  fn.updateOne = function(req, res, next) {
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

  fn.removeOne = function(req, res, next) {
    if (!validObjectid(req.params.oid)) return next("route");
    model.findByIdAndRemove(req.params.oid, function(err, entry) {
      if (err) return next(err);
      if (entry === null) return next("route");
      res.json(entry);
    });
  };

  return fn;
}

module.exports = rest;
