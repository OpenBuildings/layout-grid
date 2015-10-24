.. title:: Layout Grid

===========
Layout Grid
===========

Static responsive grid with pure css. Javascript using native drag-n-drop to reorder for each screen size on desktop and mobile.

Source code at github - `clippings/layout-grid <https://github.com/clippings/layout-grid>`_


Quick Example
-------------

Heres' a quick preview of how it could look like. You can drag these items around and see how they react to resizing.


.. raw:: html

    <div
     data-arrange="lt-grid"
     class="lt-container
            lt-xs-h-9
            lt-sm-h-6
            lt-md-h-4
            lt-lg-h-3">

        <div
         draggable="true"
         class="lt
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
            <div class="lt-body note">
                <h3>1</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-1
                lt-xs-w-1
                lt-xs-h-2
                lt-sm-x-1
                lt-sm-y-0
                lt-sm-w-1
                lt-sm-h-2
                lt-md-x-2
                lt-md-y-0
                lt-md-w-1
                lt-md-h-2
                lt-lg-x-1
                lt-lg-y-0
                lt-lg-w-1
                lt-lg-h-2">
            <div class="lt-body note">
                <h3>2</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-3
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-0
                lt-sm-y-1
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-1
                lt-md-y-0
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-0
                lt-lg-y-1
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>3</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-4
                lt-xs-w-1
                lt-xs-h-2
                lt-sm-x-0
                lt-sm-y-2
                lt-sm-w-2
                lt-sm-h-2
                lt-md-x-0
                lt-md-y-1
                lt-md-w-2
                lt-md-h-2
                lt-lg-x-2
                lt-lg-y-0
                lt-lg-w-2
                lt-lg-h-2">
            <div class="lt-body note">
                <h3>4</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-6
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-0
                lt-sm-y-4
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-2
                lt-md-y-2
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-0
                lt-lg-y-2
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>5</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-7
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-0
                lt-sm-y-5
                lt-sm-w-2
                lt-sm-h-1
                lt-md-x-1
                lt-md-y-3
                lt-md-w-2
                lt-md-h-1
                lt-lg-x-1
                lt-lg-y-2
                lt-lg-w-2
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>6</h3>
            </div>
        </div>
        <div
         draggable="true"
         class="lt
                lt-xs-x-0
                lt-xs-y-8
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-1
                lt-sm-y-4
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-0
                lt-md-y-3
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-3
                lt-lg-y-2
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>7</h3>
            </div>
        </div>
    </div>
    <p></p>

.. toctree::
   :maxdepth: 2
   :caption: Documentation

.. toctree::

   installation
   documentation

.. toctree::
   :maxdepth: 2
   :caption: Demos

   demos/static
   demos/reorder
   demos/multiple
   demos/options
   demos/resize
   demos/custom
   demos/serialization
   demos/only
   demos/admin


Credits
-------

Thanks a lot to the creator of `gridster.js <http://gridster.net />`_, where I got the inspiration for this plugin.
Built by `Ivan Kerin <https://github.com/ivank />`_ as part of `Clippings.com <https://clippings.com>`_
