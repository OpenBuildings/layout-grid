module.exports = function (grunt) {

    'use strict'

    require('load-grunt-tasks')(grunt)

    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            options: {
                configFile: 'js/.eslintrc'
            },
            js: [
                'Gruntfile.js',
                'js/src/*.js',
                'js/tests/unit/*.js'
            ]
        },

        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip',
                    level: 9
                },
                src: ['dist/**', 'sass/*', 'LICENSE', 'README.md'],
            }
        },

        jscs: {
            options: {
                config: 'js/.jscsrc'
            },
            files: {
                src: [
                    'Gruntfile.js',
                    'js/src/*.js',
                    'js/tests/unit/*.js'
                ]
            }
        },

        concat: {
            options: {
                sourceMap: true,
                stripBanners: true,
                banner: '// LICENSE: <%= pkg.license %>\n// http://git.io/vZkLP\n\n var LTGrid = (function ($) {\n\n\'use strict\'\n\n',
                footer: '\nLTGrid.Rect = Rect\nLTGrid.Grid = Grid\n\nreturn LTGrid\n\n})(jQuery)',
                process: function (src) {
                    return src.replace('\'use strict\'', '')
                }
            },
            js: {
                src: 'js/src/*.js',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        qunit: {
            options: {
                coverage: {
                    src: ['dist/js/<%= pkg.name %>.js'],
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
                sourceMap: true,
                sourceMapIn: 'dist/js/<%= pkg.name %>.js.map',
                preserveComments: 'some'
            },
            core: {
                src: '<%= concat.js.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/<%= pkg.name %>.css': 'sass/layout-grid.sass'
                }
            }
        },

        cssmin: {
            options: {
                sourceMap: true
            },
            target: {
                files: {
                    'dist/css/<%= pkg.name %>.min.css': ['dist/css/<%= pkg.name %>.css']
                }
            }
        }
    })

    grunt.registerTask('css', ['sass', 'cssmin'])
    grunt.registerTask('js', ['concat', 'uglify'])
    grunt.registerTask('test', ['eslint', 'jscs', 'qunit'])
    grunt.registerTask('dist', ['default', 'compress'])
    grunt.registerTask('default', ['css', 'js'])
}
