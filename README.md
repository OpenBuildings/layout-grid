Layout Grid
===========

[![Build Status](https://travis-ci.org/clippings/layout-grid.svg?branch=master)](https://travis-ci.org/clippings/layout-grid)
[![Codacy Badge](https://api.codacy.com/project/badge/8a76e0f9ec414ae79aca59bd9f10e24a)](https://www.codacy.com/app/clippings/layout-grid)
[![Dependency Status](https://david-dm.org/clippings/layout-grid.svg)](https://david-dm.org/clippings/layout-grid)
[![devDependency Status](https://david-dm.org/clippings/layout-grid/dev-status.svg)](https://david-dm.org/clippings/layout-grid#info=devDependencies)

Documentation and demos: [Layout Grid Site](https://clippings.github.com/layout-grid)

Static responsive grid with pure css.
Javascript using native Drag'n'drop to reorder for each screen size.

![Example Layout Grid](http://i.imgur.com/vtkdKg5.png "Layout Example")

Installation
-----------

For only static positioning include `css/layout-grid.min.css`
For ordering items around include `js/layout-grid.min.js`

Modification
------------
`sass/layout-grid.sass` allows you to modify a lot of variables for each screen size, overriding the defaults.
If you're using reorder you'll need to tell the javascript plugin about these modifications as well.

Development
-----------
After modification you can run the `npm install` and then `grunt` to build and minify all the js and sass. Use `grunt qunit` to execute the tests.

License
-------

Copyright (c) 2015, Clippings Ltd. Developed by Ivan Kerin

Under BSD-3-Clause license, read [LICENSE](LICENSE) file.
