var pkg = require("../../package.json");
var http = require("./http.js");

module.exports = {
  swagger: "2.0",
  info: {
    title: pkg.name,
    version: pkg.version,
    description: pkg.description
  },
  host: "nourriture.dennajort.fr",
  basePath: http.prefix,
  schemes: ["http"],
  consumes: ["application/x-www-form-urlencoded", "multipart/form-data"],
  produces: ["application/json"],
}
