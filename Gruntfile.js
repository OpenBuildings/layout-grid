module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        babel: {
          dev: {
            options: {
              modules: 'ignore'
            },
            files: {
              'js/dist/rect.js'         :'js/src/rect.js',
              'js/dist/grid.js'         :'js/src/grid.js',
              'js/dist/lt_rect.js'      :'js/src/lt_rect.js',
              'js/dist/lt_size.js'      :'js/src/lt_size.js',
              'js/dist/store.js'        :'js/src/store.js',
              'js/dist/lt_grid.js'      :'js/src/lt_grid.js'
            }
          },
          dist: {
            options: {
              modules: 'ignore'
            },
            files: {
              '<%= concat.js.dest %>' : '<%= concat.js.dest %>'
            }
          }
        },

        lineremover: {
          es6Import: {
            files: {
              '<%= concat.js.dest %>': '<%= concat.js.dest %>'
            },
            options: {
              exclusionPattern: /^(import|export)/g
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
    grunt.registerTask('js', ['concat', 'lineremover', 'babel']);
    grunt.registerTask('default', ['css', 'js']);
};
