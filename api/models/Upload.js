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
      return path.join(UPLOAD_DIR, this.path);
    },

    change_path: function(new_path) {
      if (!this.path || this.path == new_path) return Q();
      var d = Q.defer();
      fs.remove(this.real_path(), function(err) {
        if (err) return d.reject(err);
        d.resolve();
      });
      return d.promise;
    }
  },

  afterDestroy: function(uploads, next) {
    var tasks = _.map(uploads, function(up) {
      return function(cb) {
        fs.remove(up.real_path(), cb);
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
