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
        },
        sass: {
            dist: {
                files: {
                    'css/layout-grid.css': 'sass/layout-grid.sass',
                    'css/layout-reorder.css': 'sass/layout-reorder.sass',
                }
            }
        },
        cssmin: {
          target: {
            files: {
              'dist/layout-grid.min.css': ['css/layout-reorder.css', 'css/layout-grid.css']
            }
          }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['sass', 'cssmin', 'uglify']);
};
