/**
* Upload.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var path = require("path");
var fs = require("fs-extra");
var Q = require("q");

UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
UPLOAD_URI = "/uploads/";

function real_path(up) {
  return path.join(UPLOAD_DIR, up.path);
}

module.exports = {

  attributes: {
    path: {
      type: "string",
      required: true,
      unique: true
    },

    uri: function() {
      return path.join(UPLOAD_URI, this.path);
    },

    real_path: function() {
      return real_path(this);
    }
  },

  afterDestroy: function(uploads, next) {
    var tasks = _.map(uploads, function(up) {
      return function(cb) {
        fs.remove(real_path(up), cb);
      }
    });
    async.parallel(tasks, function(err) {
      if (err) return next(err);
      next();
    });
  },

  joinDir: function(dir) {
    return path.join(UPLOAD_DIR, dir);
  },

  UPLOAD_DIR: UPLOAD_DIR,
  UPLOAD_URI: UPLOAD_URI,
};
