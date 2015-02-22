var path = require("path");

module.exports = {
  port: 3000,
  prefix: "/api",
  token_lifetime: 3600 * 24 * 14,  // 14 days
  upload_dir: path.join(__rootDir, "uploads"),
  cors: {
    origin: true,
    credentials: true
  }
};
