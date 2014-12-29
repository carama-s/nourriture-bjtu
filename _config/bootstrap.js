/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  sails.log.info("Connection to Facebook...");
  FB.getAccessToken(sails.config.facebook.app_id, sails.config.facebook.app_secret).then(function(ok) {
    if (!ok) return cb("Error connection to Facebook");
    sails.log.info("Connected to Facebook !");
    return cb();
  }, cb);
};
