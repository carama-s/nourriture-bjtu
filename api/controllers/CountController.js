var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

function Count(req, res, next) {
  var Model = actionUtil.parseModel(req);
  var criteria = actionUtil.parseCriteria(req);

  Model.count(criteria).then(function(count) {
    res.json({count: count});
  }, next);
}

module.exports.Count = Count;
