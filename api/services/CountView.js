var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

function wrapper(Model) {
  return function(req, res, next) {
    var criteria = actionUtil.parseCriteria(req);

    Model.count(criteria).then(function(count) {
      res.json({count: count});
    }, next);
  };
}

module.exports = wrapper;
