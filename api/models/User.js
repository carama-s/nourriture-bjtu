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
    hashedPasswd: {
      type: "string"
    },
    tokens: {
      collection: "token",
      via: "user"
    },

    toJSON: function() {
      var o = this.toObject();
      delete o.hashedPasswd;
      delete o.tokens;
      return o;
    }
  },

  beforeCreate: function(values, next) {
    if (!values.passwd || values.passwd != values.passwdConfirmation) {
      return next({err: ["Password doesn't match password confirmation."]});
    }

    PasswdService.hash(values.passwd, function(err, hash) {
      if (err) return next(err);
      values.hashedPasswd = hash;
      next();
    });
  }
};
