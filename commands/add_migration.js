function add_migration(args) {
  var argv = require("yargs")(args)
    .demand(1)
    .argv;

  var mig_name = argv._[0];

  if (!/^\w+$/.test(mig_name)) {
    console.error("Wrong migration name");
    process.exit(1);
  }

  var fs = require("fs-extra");
  var path = require("path");

  fs.readdir(path.join(__rootDir, "migrations"), function(err, files) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    function get_mig_nb(name) { return Number(name.split("-", 1)[0]); }

    var mig_regexp = /^\d+-\w+\.js$/;
    files = _.filter(files, function(a) { return mig_regexp.test(a); });
    files = _.sortBy(files, get_mig_nb);

    var next_nb = _.last(files);
    next_nb = (next_nb === undefined) ? 0 : (get_mig_nb(next_nb) + 1);
    var final_name = ("0000" + next_nb).slice(-4) + "-" + mig_name + ".js";

    fs.copy(
      path.join(__rootDir, "templates", "migration.js"),
      path.join(__rootDir, "migrations", final_name),
      function(err) {
        if (err) {
          console.error("Can't copy migration template");
          process.exit(1);
        }
        console.log("Migration %s created !", final_name);
        process.exit(0);
      }
    );
  });
}

module.exports = {
  fn: add_migration,
  desc: "Create a new migration"
};
