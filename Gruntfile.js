module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    qunit: {
      all: ['tests/*.html']
    },
    uglify: {
        js: {
          files: {
            'dist/layout-grid.min.js': ['js/layout-grid.js']
          }
        }
      }
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['qunit']);
};
