function makeConnection() {
  if (process.env.NODE_ENV === "production") return {
    adapter: "mongoDB",
    host: 'localhost',
    port: 27017,
    database: 'nourriture'
  }
  if (process.env.NODE_ENV === "test") return {
    adapter: "memory"
  }
  return {
    adapter: "disk"
  }
}

module.exports = {
  adapters: {
    'default': 'disk',
    disk: require("sails-disk"),
    memory: require("sails-memory"),
    mongoDB: require('sails-mongo')
  },

  connections: {
    "default": makeConnection()
  },

  defaults: {
    migrate: 'alter'
  }
};
