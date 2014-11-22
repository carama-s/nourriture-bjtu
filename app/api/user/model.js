var mongoose = require("mongoose");
var validate = require("mongoose-validator");
var bcrypt = require("bcrypt");

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
  }]
});

userSchema.statics.hashPasswd = function(data, done) {
  bcrypt.hash(data, 10, done);
};

userSchema.methods.checkPasswd = function(passwd, done) {
  bcrypt.compare(passwd, this.passwd, done);
};

userSchema.pre("save", function(next) {
  var user = this;

  if (!user.isModified("passwd")) return next();

  User.hashPasswd(user.passwd, function(err, hash) {
    if (err) return next(err);
    user.passwd = hash;
    next();
  });
});

if (!userSchema.options.toJSON) userSchema.options.toJSON = {};
userSchema.options.toJSON.transform = function(doc, ret, opts) {
  delete ret.passwd;
  delete ret.tokens;
};

userSchema.plugin(require("mongoose-unique-validator"));

var User = mongoose.model("User", userSchema);

module.exports = User;
