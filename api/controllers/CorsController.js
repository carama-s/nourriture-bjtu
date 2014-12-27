/**
 * CorsController
 *
 * @description :: Server-side logic for managing cors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	preflight: require("cors")()
};
