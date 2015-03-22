function getWaterline() {
  switch (process.env.NODE_ENV) {
    case "production":
      return {
        adapters: {
          "mongoDB": require("sails-mongo")
        },
        connections: {
          "default": {
            adapter: "mongoDB",
            host: process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost',
            port: process.env.MONGODB_PORT_27017_TCP_PORT || 27017,
            database: 'nourriture'
          }
        }
      };
    case "test":
      return {
        adapters: {
          "memory": require("sails-memory")
        },
        connections: {
          "default": {adapter: "memory"}
        }
      };
    default:
      return {
        adapters: {
          "disk": require("sails-disk")
        },
        connections: {
          "default": {adapter: "disk", filePath: "/tmp/db/"}
        }
      };
  }
  return {};
}

module.exports = getWaterline();
module.exports.defaults = {
  migrate: "alter"
};
