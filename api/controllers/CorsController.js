/**
 * CorsController
 *
 * @description :: Server-side logic for managing cors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	preflight: function(req, res, next) {
		sails.log("HELLLO CORS");
		require("cors")()(req, res, next);
	}
};
