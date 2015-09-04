module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            options: {
                '--web-security': 'no',
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
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['sass', 'cssmin', 'uglify']);
};
