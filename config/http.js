var path = require("path");

module.exports = {
  port: 3000,
  prefix: "/api",
  upload_dir: path.join(__dirname, "uploads")
};
