/**
 * TokenController
 *
 * @description :: Server-side logic for managing Tokens
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var crypto = require("crypto");
var uuid = require("node-uuid");

module.exports = {
	"get_token": function(req, res, next) {
		if (req.method != "POST") {
			res.send(405);
		} else {
			if (req.body.email && req.body.passwd) {
				User.findOne({email: req.body.email})
					.populate("tokens")
					.exec(function(err, user) {
						if (err) return next(err);
						if (!user) {
							res.send(400, {error: "Invalid credentials. User doesn't exists."});
						} else {
							PasswdService.compare(req.body.passwd, user.passwd, function(err, ok) {
								if (err) return next(err);
								if (!ok) {
									res.send(400, {error: "Invalid credentials. Wrong password."});
								} else if (user.tokens.length > 0) {
									res.send({token: user.tokens[0].token});
								} else {
									var shasum = crypto.createHash("sha256");
									shasum.update(uuid.v1());
									Token.create({token: shasum.digest("hex"), user: user.id}, function(err, token) {
										if (err) return next(err);
										res.send({token: token.token});
									});
								}
							});
						}
					});
			} else {
				res.send(400, {error: "Missing parameters."});
			}
		}
	}
};
