var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var uuid = require("node-uuid");

function generateToken() {
  var shasum = crypto.createHash("sha256");
  shasum.update(uuid.v1());
  return shasum.digest("hex");
}

var User = new mongoose.Schema({
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
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    default: "na",
    enum: ["male", "female", "na"]
  },
  passwd: {
    type: String,
    required: true
  },
  token: {
    token: {
      type: String,
      required: true,
      unique: true,
      default: generateToken
    }
  },
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

User.statics.hashPasswd = function(data) {
  return Q.nfcall(bcrypt.hash, data, 10);
};

User.statics.generateToken = generateToken;

User.methods.checkPasswd = function(passwd) {
  return Q.nfcall(bcrypt.compare, passwd, this.passwd);
};

User.pre("save", function(next) {
  var user = this;

  if (!user.isModified("passwd")) return next();

  User.statics.hashPasswd(user.passwd)
    .then(function(hash) {
      user.passwd = hash;
      next();
    }, next);
});

if (!User.options.toJSON) User.options.toJSON = {};
User.options.toJSON.transform = function(doc, ret, opts) {
  delete ret.passwd;
  delete ret.token;
};

User.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("User", User);
