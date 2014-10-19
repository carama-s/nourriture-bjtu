var bcrypt = require("bcrypt");

module.exports = {
  hash: function(data, cb) {
    bcrypt.hash(data, 10, cb);
  },
  compare: bcrypt.compare
};
