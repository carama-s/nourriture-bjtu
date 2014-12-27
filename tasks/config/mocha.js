module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    test: {
      options: {
        reporter: 'spec'
      },
      src: ['tests/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

};
