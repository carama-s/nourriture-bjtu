#!/usr/bin/node
var app = require("../app.js");
var config = require("../config.json");

console.log("Connecting to MongoDB...");
app.db.on("error", function(err) {
  console.log("Error connection to MongoDB:", err);
});

app.db.once("open", function() {
  console.log("Connected to MongoDB !");
  console.log();
  console.log("Starting HTTP server...");
  app.app.listen(config.express.port, function() {
    console.log("HTTP server started !");
    console.log();
  });
});
