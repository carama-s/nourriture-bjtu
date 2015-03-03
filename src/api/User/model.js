var bcrypt = require("bcrypt");

function hashPasswd(data) {
  return Q.nfcall(bcrypt.hash, data, 10);
}

module.exports = {
  connection: "default",
  identity: "user",
  schema: true,

  attributes: {
    username: {
      type: "string",
      unique: true,
      required: true
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      email: true
    },
    facebook_id: {
      type: "string",
      unique: true,
      protected: true
    },
    firstname: {
      type: "string",
      required: true
    },
    lastname: {
      type: "string",
      required: true
    },
    gender: {
      type: "string",
      required: true,
      defaultsTo: "na",
      enum: ["male", "female", "na"]
    },
    passwd: {
      type: "string",
      required: true,
      protected: true
    },
    tokens: {
      collection: "token",
      via: "user",
      protected: true
    },
    comments: {
      collection: "recipe_comment",
      via: "user"
    },
    admin: {
      type: "integer",
      required: true,
      defaultsTo: 10
    },

    checkPasswd: function(passwd) {
      return Q.nfcall(bcrypt.compare, passwd, this.passwd);
    },

    changePasswd: function(new_passwd) {
      this.newPasswd = new_passwd;
      return this.save();
    }
  },

  beforeCreate: function(values, next) {
    hashPasswd(values.passwd).then(function(hash) {
      values.passwd = hash;
      next();
    }, next);
  },

  beforeUpdate: function(values, next) {
    if (values.newPasswd) {
      return hashPasswd(values.newPasswd).then(function(hash) {
        values.passwd = hash;
        next();
      }, next);
    }
    next();
  },

  afterDestroy: function(users, cb) {
    Token.destroy({user: _.pluck(users, 'id')}).exec(cb);
  },

  toPopulate: [],

  hashPasswd: hashPasswd
};
