module.exports = function(cb) {
  function Parser(req) {
    var obj = {};

    obj.criteria = function() {
      var blacklist = ["sort", "skip", "limit"];
      var where = req.query.where;
      if (_.isString(where)) {
        try {
          where = JSON.parse(where);
        } catch(err) {
        }
      }
      if (!where) {
        where = req.query;
        where = _.omit(where, blacklist);
      }
      return where;
    };

    obj.sort = function() {
      return req.query.sort;
    };

    obj.skip = function() {
      return req.query.skip;
    };

    obj.limit = function() {
      return req.query.limit;
    };

    return obj;
  }

  cb(null, Parser);
};
