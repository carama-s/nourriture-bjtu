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
var formidable = require("formidable");
var fs = require("fs-extra");

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
//      'bodyParser',
      "cors",
      "formidable",
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      "passportInit",
      "passportConfig",
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    cors: require("cors")(function(req, next) {
      var opts = {origin: true};
      sails.log(req);
      next(null, opts);
    }),

    passportInit: passport.initialize(),

    passportConfig: function(req, res, next) {
      passport.authenticate('bearer', {session: false}, function(err, user) {
        if (err) return next(err);
        if (!user) return next();
        req.logIn(user, function(err) {
          if (err) return next(err);
          next();
        });
      })(req, res);
    },

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')
    formidable: function(req, res, next) {
      var form = new formidable.IncomingForm();
      form.keepExtensions = true;

      form.parse(req, function(err, fields, files) {
        if (err) return next(err);
        req.body = fields;
        req.files = files;
        req.form = form;

        res.on("finish", function() {
          var tasks = _.map(files, function(file) {
            return function(cb) {
              fs.exists(file.path, function(exists) {
                if (!exists) return cb();
                fs.remove(file.path, function(err) {
                  if (err) return cb(err);
                  cb();
                });
              });
            }
          });

          async.parallel(tasks);
        });

        next();
      });
    }

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
