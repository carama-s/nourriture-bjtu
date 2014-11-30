// Add globals
global._ = require("underscore");
global.common = require("./common");

module.exports = {
  api: require("./api"),
  app: require("./app.js")
};
