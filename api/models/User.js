/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,

  attributes: {
    username: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      email: true,
      required: true,
      unique: true
    },
    passwd: {
      type: "string",
      required: true
    },
    tokens: {
      collection: "token",
      via: "user"
    },

    toJSON: function() {
      var o = this.toObject();
      delete o.passwd;
      delete o.tokens;
      return o;
    }
  },

  beforeCreate: function(values, next) {
    PasswdService.hash(values.passwd, function(err, hash) {
      if (err) return next(err);
      values.passwd = hash;
      next();
    });
  }
};
