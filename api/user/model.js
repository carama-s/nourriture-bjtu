var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var uuid = require("node-uuid");

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validate({validator: "isEmail"})]
  },
  passwd: {
    type: String,
    required: true
  },
  tokens: [{
    token: {type: String, required: true, unique: true}
  }],
  admin: {
    type: Number,
    required: true,
    default: 10
  }
});

/*
  admin is a Number
  10: Normal user
  0: SuperAdmin
*/

userSchema.statics.hashPasswd = function(data, done) {
  var d = Q.defer();
  bcrypt.hash(data, 10, d.makeNodeResolver());
  return d.promise.nodeify(done);
};

userSchema.statics.generateToken = function() {
  var shasum = crypto.createHash("sha256");
  shasum.update(uuid.v1());
  return shasum.digest("hex");
};

userSchema.methods.checkPasswd = function(passwd, done) {
  var d = Q.defer();
  bcrypt.compare(passwd, this.passwd, d.makeNodeResolver());
  return d.promise.nodeify(done);
};

userSchema.pre("save", function(next) {
  var user = this;

  if (!user.isModified("passwd")) return next();

  User.hashPasswd(user.passwd)
    .then(function(hash) {
      user.passwd = hash;
      next();
    }, next);
});

if (!userSchema.options.toJSON) userSchema.options.toJSON = {};
userSchema.options.toJSON.transform = function(doc, ret, opts) {
  delete ret.passwd;
  delete ret.tokens;
};

userSchema.plugin(require("mongoose-unique-validator"));

var User = mongoose.model("User", userSchema);

module.exports = User;
