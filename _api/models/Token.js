/**
* Token.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require("crypto");
var uuid = require("node-uuid");

function generateToken() {
  var shasum = crypto.createHash("sha256");
  shasum.update(uuid.v1());
  return shasum.digest("hex");
}

module.exports = {

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
    }
  },

  generateToken: generateToken
};
