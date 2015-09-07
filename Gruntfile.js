module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        lineremover: {
            usestrict: {
                options: {
                    exclusionPattern: /^('use strict';)/g
                },
                files: {
                    '<%= concat.js.dest %>': '<%= concat.js.dest %>'
                }
            }
        },

        concat: {
          options: {
            stripBanners: false
          },
          js: {
            src: [
              'js/src/*.js',
            ],
            dest: 'dist/js/<%= pkg.name %>.js'
          }
        },

        stamp: {
            options: {
                banner: "'use strict';\n\n var LTGrid = (function ($) {\n",
                footer: '    LTGrid.Rect = Rect\n    LTGrid.Grid = Grid\n    return LTGrid\n})(jQuery);'
            },
            dist: {
                files: {
                    src: '<%= concat.js.dest %>'
                }
            }
        },

        qunit: {
            options: {
                coverage: {
                  src: ['dist/js/layout-grid.js'],
                  instrumentedFiles: 'temp/',
                  htmlReport: 'build/coverage',
                  lcovReport: 'build/',
                }
            },
            all: ['js/tests/index.html']
        },

        uglify: {
            options: {
                mangle: true,
                preserveComments: 'some'
            },
            core: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },

        sass: {
            options: {
                sourcemap: 'none'
            },
            dist: {
                files: {
                    'dist/css/layout-grid.css': 'sass/layout-grid.sass'
                }
            }
        },

        cssmin: {
          target: {
            files: {
              'dist/css/layout-grid.min.css': ['css/layout-grid.css']
            }
          }
        }
    });

    grunt.registerTask('css', ['sass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'lineremover', 'stamp']);
    grunt.registerTask('default', ['css', 'js']);
};
