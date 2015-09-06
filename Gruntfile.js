module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        qunit: {
            options: {
                coverage: {
                  src: ['js/layout-grid.js'],
                  instrumentedFiles: 'temp/',
                  htmlReport: 'build/coverage',
                  lcovReport: 'build/',
                }
            },
            all: ['tests/*.html']
        },
        uglify: {
            js: {
                files: {
                    'js/layout-grid.min.js': ['js/layout-grid.js']
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'css/layout-grid.css': 'sass/layout-grid.sass'
                }
            }
        },
        cssmin: {
          target: {
            files: {
              'css/layout-grid.min.css': ['css/layout-grid.css']
            }
          }
        }
    });

    grunt.registerTask('default', ['sass', 'cssmin', 'uglify']);
};
