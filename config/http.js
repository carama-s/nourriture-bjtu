/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

var passport = require("passport");

module.exports.http = {

  middleware: {

    passportInit: passport.initialize(),
    passportBearer: function(req, res, next) {
      passport.authenticate('bearer', {session: false}, function(err, user) {
        if (err) return next(err);
        if (!user) return next();
        req.logIn(user, function(err) {
          if (err) return next(err);
          next();
        });
      })(req, res);
    },

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'passportInit',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      "passportBearer",
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ]
  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
