module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            options: {
                configFile: 'js/.eslintrc'
            },
            target: 'js/src/*.js'
        },

        jscs: {
            options: {
                config: 'js/.jscsrc'
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            core: {
                src: 'js/src/*.js'
            },
            test: {
                src: 'js/tests/unit/*.js'
            }
        },

        lineremover: {
            usestrict: {
                options: {
                    exclusionPattern: /^('use strict')/g
                },
                files: {
                    '<%= concat.js.dest %>': '<%= concat.js.dest %>'
                }
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: '// LICENSE: <%= pkg.license %>\n// http://git.io/vZkLP\n\n\'use strict\';\n\n var LTGrid = (function ($) {\n',
                footer: '\nLTGrid.Rect = Rect\nLTGrid.Grid = Grid\n\nreturn LTGrid\n\n})(jQuery);',
                process: function (src, filepath) {
                    return src.replace('\'use strict\'', '')
                }
            },
            js: {
                src: [
                  'js/src/*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        qunit: {
            options: {
                coverage: {
                    src: ['dist/js/layout-grid.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'build/coverage',
                    lcovReport: 'build/'
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
                    'dist/css/layout-grid.min.css': ['dirst/css/layout-grid.css']
                }
            }
        }
    });

    grunt.registerTask('css', ['sass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('test', ['eslint', 'jscs', 'qunit']);
    grunt.registerTask('default', ['css', 'js']);
};
