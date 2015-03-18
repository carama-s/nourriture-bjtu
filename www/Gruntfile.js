module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      uglify: {
        options: {
          mangle: true,
          sourceMap : true,
          compress: {
            warnings: false,
            drop_console: false,
            sequences: true,
            dead_code: true,
            conditionals: true,
            comparisons: true,
            booleans: true,
            loops: true,
            unused: true,
            if_return: true,
            join_vars: true,
            cascade: true
          },
          report: "gzip",
          preserveComments: false
        },
        dest: "www/scripts.min.js",
        src: ["www/scripts/**/*.js"]
      }
    },
    less: {
      less: {
        options: {
          compress: true,
          optimization: 2,
        },
        files: {
          "www/styles/css/style.css": "www/styles/less/style.less"
        }
      }
    },
    watch: {
      styles: {
        files: ['www/styles/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      uglify: {
        files: ["www/scripts/**/*.js"],
        tasks: ["uglify"],
        options: {
          nospawn: true
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['less', "uglify", 'watch']);

  grunt.registerTask('deploy', ['less', "uglify"]);
};
