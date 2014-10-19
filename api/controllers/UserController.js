/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	signup: function(req, res, next) {
		if (req.method != "POST") {
			res.send(405);
		} else {
			User.create(req.body, function(err, user) {
				if (err) return next(err);
				res.send(user);
			});
		}
	}
};
