var path = require("path");

module.exports = {
  port: 3000,
  prefix: "/api",
  io_uri: "/io/",
  upload_dir: path.join(__rootDir, "uploads")
};
