var path = require("path");

module.exports = {
  port: 3000,
  prefix: "/api",
  upload_dir: path.join(__rootDir, "uploads"),
  cors: {
    origin: true,
    credentials: true
  },
  io: {
    adapter: {
      host: 'localhost',
      port: 6379,
      key: "nourriture_socket.io"
    }
  }
};
