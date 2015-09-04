Layout Grid
===========

[![Build Status](https://travis-ci.org/clippings/layout-grid.svg?branch=master)](https://travis-ci.org/clippings/layout-grid)
[![Test Coverage](https://codeclimate.com/github/clippings/layout-grid/badges/coverage.svg)](https://codeclimate.com/github/clippings/layout-grid/coverage)

Documentaion and demos: [Layout Grid Site](https://clippings.github.com/layout-grid)

Static responsive grid with pure css.
Javascript using native Drag'n'drop to reorder for each screen size.

![Example Layout Grid](http://i.imgur.com/vtkdKg5.png "Layout Example")

Instalation
-----------

For only static positioning include ``css/layout-grid.min.css``
For ordering items around include ``js/layout-grid.min.js``

Modification
------------
``sass/layout-grid.sass`` allows you to modify a lot of variables for each screen size, overriding the defaults.
If you're using reoder you'll need to tell the javascript plugin about these modifications as well.

Development
-----------
After modification you can run the ``npm install`` and then ``grunt`` to build and minify all the js and sass. Use ``grunt qunit`` to execute the tests.

License
-------

Copyright (c) 2015, Clippings Ltd. Developed by Ivan Kerin

Under BSD-3-Clause license, read LICENSE file.
