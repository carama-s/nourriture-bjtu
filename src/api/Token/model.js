var crypto = require("crypto");
var uuid = require("node-uuid");

function generateToken() {
  var shasum = crypto.createHash("sha1");
  shasum.update(uuid.v4());
  return shasum.digest("hex");
}

function now() {
  return Math.floor(_.now() / 1000);
}

function destroyExpiredTokens() {
  return Token.destroy({lastAccess: {"<": now() - APP.config.http.token_lifetime}});
}

module.exports = {
  connection: "default",
  identity: "token",

  attributes: {
    user: {
      model: "user",
      required: true
    },
    token: {
      type: "string",
      required: true,
      defaultsTo: generateToken,
      primaryKey: true
    },
    lastAccess: {
      type: "integer",
      defaultsTo: now,
      required: true
    },

    updateAccess: function() {
      this.lastAccess = now();
      return this.save();
    },

    stillValid: function() {
      return (now() < (this.lastAccess + APP.config.http.token_lifetime));
    }
  },

  toPopulate: [],

  generateToken: generateToken,
  destroyExpiredTokens: destroyExpiredTokens
};
