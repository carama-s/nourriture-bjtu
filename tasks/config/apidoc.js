module.exports = function(grunt) {

  grunt.config.set('apidoc', {
    mypp: {
      src: "api/controllers/",
      dest: "assets/api/doc/",
      options: {
        debug: true,
        includeFilters: [ ".*\\.js$" ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-apidoc');

};
