#!/usr/bin/env node
global._ = require("underscore");
global.__rootDir = __dirname;

if (require.main === module) {
  var commands = require("./commands");
  var command = process.argv[2];

  function show_commands() {
    console.log("The following commands are available");
    console.log();
    for (c in commands) {
      console.log("   %s : %s", c, commands[c].desc);
    }
  }

  if (command === undefined) {
    console.error("Provide a command please");
    console.error();
    show_commands();
    process.exit(1);
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
