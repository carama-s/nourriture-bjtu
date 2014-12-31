function makeConnections() {
  if (process.env.NODE_ENV === "production") return {
    "default": {
      adapter: "mongoDB",
      host: 'localhost',
      port: 27017,
      database: 'nourriture'
    },
    "fast": {
      adapter: "redis",
      port: 6379,
      host: 'localhost'
    }
  }
  if (process.env.NODE_ENV === "test") return {
    "default": {adapter: "memory"},
    "fast": {adapter: "memory"}
  }
  return {
    "default": {adapter: "disk"},
    "fast": {adapter: "disk"}
  }
}

module.exports = {
  adapters: {
    'default': 'disk',
    disk: require("sails-disk"),
    memory: require("sails-memory"),
    mongoDB: require('sails-mongo'),
    redis: require("sails-redis")
  },

  connections: makeConnections(),

  defaults: {
    migrate: 'alter',
    schema: true
  }
};
