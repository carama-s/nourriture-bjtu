#!/usr/bin/env node
global._ = require("underscore");
global.Q = require("q");
global.__rootDir = __dirname;

if (require.main === module) {
  var commands = require("./commands");
  var command = process.argv[2] || "runserver";

  function show_commands() {
    console.log("The following commands are available");
    console.log();
    for (c in commands) {
      console.log("   %s : %s", c, commands[c].desc);
    }
  }

  var fn = commands[command];

  if (fn === undefined) {
    console.error("Command %s unknown", process.argv[2]);
    console.error();
    show_commands();
    process.exit(1);
  }

  fn.fn(process.argv.slice(3));
}
