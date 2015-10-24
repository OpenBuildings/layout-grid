
=============
Documentation
=============

There are 2 primary components - the css, which is responsible for positioning and the javascript plugin, used to change that positioning. You can use only the css without any javascript and still get a nice responsive grid.

Layout grid uses `bootstrap's breakpoints <http://getbootstrap.com/css/#grid-media-queries />`_ by default (configurable). They are as follows:

===================================  ===============
Name                                 Value
===================================  ===============
Extra small devices (Phones >768px)  xs
Small devices (Tablets (≥768px))     sm
Medium devices (Desktops (≥992px))   md
Large devices (Desktops (≥1200px))   lg
===================================  ===============

We start with the basic html structure:

.. code-block:: html

    <div class="lt-container lt-xs-h-6">
        <div class="lt lt-xs-x-0 lt-xs-y-0 lt-xs-w-1 lt-xs-h-1">
            <div class="lt-body">
                Your content
            </div>
        </div>
    </div>

``lt-xs-h-6`` on the lt-container means the height on screen size "xs" the height will be 6 counts. ``lt-xs-x-0`` on the item means the x position on screen size "xs"

Classes
-------

======================  ========================================================================
Name                    Value
======================  ========================================================================
lt-{size}-x-{number}    Horizontal Position on xs screen size, starts from and defaults to 0
lt-{size}-y-{number}    Vertical Position on xs screen size, starts from and defaults to 0
lt-{size}-w-{number}    Width on xs screen size, starts from and defaults to 1
lt-{size}-h-{number}    Height on xs screen size, starts from and defaults to 1
======================  ========================================================================

Here's how it looks when every class for every screen size is set:

.. code-block:: html

    <div class="lt-container lt-xs-h-6">
        <div class="lt
                       lt-xs-x-0
                       lt-xs-y-0
                       lt-xs-w-1
                       lt-xs-h-1
                       lt-sm-x-0
                       lt-sm-y-0
                       lt-sm-w-1
                       lt-sm-h-1
                       lt-md-x-0
                       lt-md-y-0
                       lt-md-w-1
                       lt-md-h-1
                       lt-lg-x-0
                       lt-lg-y-0
                       lt-lg-w-1
                       lt-lg-h-1">
            <div class="lt-body">
                Your content
            </div>
        </div>
    </div>

As with other bootstrap classes the smaller sizes act as the default for larger ones, so you need to set only the things that change of the larger sizes.

Reordering with Javascript
--------------------------

Javascript is initialized via ``data-arrange="lt-grid"`` and setting up html5's ``draggable="true"`` on the individual items. The javascript is initialized only on the event of a drag on these items.

.. code-block:: html

    <div
     class="lt-container lt-xs-h-6"
     data-arrange="lt-grid">
        <div
         class="lt lt-xs-x-0 lt-xs-y-0 lt-xs-w-1 lt-xs-h-1"
         draggable="true">
            <div class="lt-body">
                Your content
            </div>
        </div>
    </div>

Custom Options
--------------

Layout Grid comes with these options and their defaults. All of them can be changed both through javascript or using html5 data attributes. They can also be changed on the fly.

.. code-block:: javascript

    LTGrid.DEFAULTS = {
        resize: true,
        overlap: false,
        compact: true,
        params: {
            lg: {
                gap: 1,
                maxWidth: Number.MAX_VALUE,
                cols: 4,
                aspect: 2/3
            },
            md: {
                gap: 2,
                maxWidth: 1200,
                cols: 3,
                aspect: 2/3
            },
            sm: {
                gap: 3,
                maxWidth: 992,
                cols: 2,
                aspect: 2/3
            },
            xs: {
                gap: 4,
                maxWidth: 768,
                cols: 1,
                aspect: 2/3
            }
        }
    };

=============  ========================================================================
Option         Description
=============  ========================================================================
resize         Horizontal Position on xs screen size, starts from and defaults to 0
overlap        Vertical Position on xs screen size, starts from and defaults to 0
compact        When set to true will try to reduce the vertical spaces between items as much as possible
params         holds the default values from the sass variables. You'll need to set them to the new values here if you've changed them in the sass file, since we can't infer them from the css automatically.
=============  ========================================================================

You can set options with data attributes:

.. code-block:: html

    <div
     id="grid"
     class="lt-container lt-xs-h-6"
     data-arrange="lt-grid"
     data-resize="false"
     data-params='{"xs":{"cols":2}}'>
       ...
    </div>

Or with javascript directly

.. code-block:: javascript

    // Javascript
    $('#grid').ltGrid({resize: false, params: {xs: {cols: 2}}});

    // On the fly modification
    $('#grid').ltGrid('option', 'resize', false);
    $('#grid').ltGrid('option', 'params', {xs: {cols: 2}});


Javascript methods
------------------

Layout grid has a lot of methods that it uses internally but can be called as part of the API - some of the methods are documented here, all the others have docs in the source.



Rect object
~~~~~~~~~~~

Layout grid uses a "Rect" object internally to do calculations, this is simply an object that holds width, height, x and y, and has some utility methods along the way.

You can create your own "Rect" objects like this ``var rect = new $.lt.Rect(x, y, width, height)``.

``rect.x`` ``rect.y`` ``rect.w`` ``rect.h`` attributes for x, y, width and height respectively

``rect.bottom()`` to get the height + y

``rect.right()`` to get the width + x

``rect.intersect(rect2)`` returns true if the two rects intersect

``rect.setCss(classes, size)`` Modify a "css classes" string with the pos and size of this rect, for a specific screen size

``rect.loadCss(classes, size)`` Load data from "css classes", for a specific screen size



ltRect
~~~~~~

``$(..).ltRect()`` is a jquery function that is a setter / getter for the "rect" object of a given widget.
You need to pass "size" as the first argument so it knows for which size the rect is being viewed / modified.

.. code-block:: javascript

    var rect = $('#widget1.lt').ltRect('lg')
    rect.x = 2;
    rect.w = 2;
    $('#widget1.lt').ltRect('lg', rect);



ltSize
~~~~~~

``$(..).ltSize()`` is a jquery function to get the current "size" of the grid, can be "lg", "md", "sm" or "xs"

.. code-block:: javascript

    var size = $('#container').ltSize();
    console.log(size);



ltData
~~~~~~

``$(..).ltData(size)`` is a jquery function to get or set the positioning data for the whole grid, for a specific size.

.. code-block:: javascript

    var data = $('#container').ltData('lg');
    console.log(JSON.stringify(data));

    $('#container').ltData('lg', JSON.parse(jsonData));



.ltGrid('option')
~~~~~~~~~~~~~~~~~

``$(..).ltGrid('option', option, value)`` allows you to set an option on the fly

.. code-block:: javascript

    $('#container').ltGrid('option', 'compact', false);



.ltGrid('compact')
~~~~~~~~~~~~~~~~~~

``$(..).ltGrid('compact')`` Compacts the grid, reducing horizontal space. It ignores the compact option setting.

.. code-block:: javascript

    $('#container').ltGrid('compact');



.ltGrid('resize')
~~~~~~~~~~~~~~~~~

``$(..).ltGrid('resize')`` Resize the grid, setting the minimum possible size for the container. It ignores the resize option setting.

.. code-block:: javascript

    $('#container').ltGrid('resize');



.ltGrid('update')
~~~~~~~~~~~~~~~~~

``$(..).ltGrid('update')`` Call resize and compact, based on the options.

.. code-block:: javascript

    $('#container').ltGrid('update');



.ltGrid('reposition')
~~~~~~~~~~~~~~~~~~~~~

``$(..).ltGrid('reposition', $widget, {x: 1, y: 1, w: 1, h: 1})`` Modify the position or size of a widget inside the grid (and call "update" method). Any parameter can be omitted so you can either set only position or only size.

.. code-block:: javascript

    $('#container').ltGrid('reposition', $('#widget1'), {x: 1, y: 1, w: 1, h: 1});


ltGridOnly
~~~~~~~~~~

In order to allow easier building of admin interfaces where you need to show the arrangement for a specific "size" regardless of the actual size of the window, you can use the ``ltGridOnly`` plugin.

This gives you 4 classes: ``only-xs``, ``only-sm``, ``only-md`` and ``only-lg`` that you can add to your layout grid to force it to show only one size.

.. code-block:: html

    <div
     id="grid"
     class="lt-container lt-xs-h-6 only-sm"
     data-arrange="lt-grid">
       ...
    </div>

The plugin itself allows you to create buttons for specific sizes

.. code-block:: html

    <button
     type="button"
     data-toggle="lt-grid-only"
     data-target="#grid"
     data-only="xs">
       Set "xs" size.
    </div>

=============  ========================================================================
Option         Description
=============  ========================================================================
data-only      The desired size: xs, sm, md or lg, if left empty will perform a clear
target         A selector pointing to the layout grid
=============  ========================================================================

