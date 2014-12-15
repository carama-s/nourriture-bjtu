var mongoose = require("mongoose");
var Q = require("q");
var ObjectId = mongoose.Schema.Types.ObjectId;

var GridFile = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    unique: true
  }
});

GridFile.virtual('url').get(function() {
  return "/grid_file" + this.path;
});

GridFile.methods.createWriteStream = function() {
  return gfs.createWriteStream({filename: this.path});
};

GridFile.methods.createReadStream = function() {
  return gfs.createReadStream({filename: this.path});
};

GridFile.pre("remove", function(next) {
  gfs.remove({filename: this.path}, function(err) {
    next();
  });
});

if (!GridFile.options.toJSON) GridFile.options.toJSON = {};
GridFile.options.toJSON.transform = function(doc, ret, opts) {
  delete ret.path;
  delete ret._id;
};

GridFile.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("GridFile", GridFile);
