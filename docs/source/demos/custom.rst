===========
Custom demo
===========

You can have different column counts, aspect ratios and gaps from the defaults.

This has custom sass configuration. Modified gap, column count and aspect ratio for each screen size. In order for these changes to work with the javascript though, we need to pass them as data attribute to the plugin.

.. code-block:: html

    <div
     data-arrange="lt-grid"
     class="lt-container
            lt-xs-h-6
            lt-sm-h-5
            lt-md-h-4
            lt-lg-h-3"
     data-params='{
        "lg":{
            "gap":4,
            "cols":5,
            "aspect":0.5},
        "md":{
            "gap":6,
            "cols":4,
            "aspect":0.6666666667},
        "sm":{
            "gap":8,
            "cols":3,
            "aspect":1},
        "xs":{
            "gap":12,
            "cols":2,
            "aspect":1.5}
     }'>

.. raw:: html

    <link rel="stylesheet" href="../_static/layout-grid-custom.min.css" type="text/css">

    <div
     data-arrange="lt-grid"
     class="lt-container
            lt-xs-h-6
            lt-sm-h-5
            lt-md-h-4
            lt-lg-h-3"
     data-params='{
        "lg":{
            "gap":4,
            "cols":5,
            "aspect":0.5},
        "md":{
            "gap":6,
            "cols":4,
            "aspect":0.6666666667},
        "sm":{
            "gap":8,
            "cols":3,
            "aspect":1},
        "xs":{
            "gap":12,
            "cols":2,
            "aspect":1.5}
     }'>
        <div draggable="true" class="lt
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

        <div draggable="true" class="lt
                lt-xs-x-0
                lt-xs-y-1
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-2
                lt-sm-y-0
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
        <div draggable="true" class="lt
                lt-xs-x-0
                lt-xs-y-2
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


        <div draggable="true" class="lt
                lt-xs-x-0
                lt-xs-y-4
                lt-xs-w-1
                lt-xs-h-2
                lt-sm-x-2
                lt-sm-y-1
                lt-sm-w-1
                lt-sm-h-2
                lt-md-x-3
                lt-md-y-0
                lt-md-w-1
                lt-md-h-2
                lt-lg-x-4
                lt-lg-y-1
                lt-lg-w-1
                lt-lg-h-2">
            <div class="lt-body note">
                <h3>7</h3>
            </div>
        </div>


    <div draggable="true" class="lt
                lt-xs-x-1
                lt-xs-y-0
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
        </div><div draggable="true" class="lt
                lt-xs-x-1
                lt-xs-y-2
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-0
                lt-sm-y-1
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-2
                lt-md-y-2
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-4
                lt-lg-y-0
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>5</h3>
            </div>
        </div><div draggable="true" class="lt
                lt-xs-x-1
                lt-xs-y-3
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-0
                lt-sm-y-4
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
        </div><div draggable="true" class="lt
                lt-xs-x-1
                lt-xs-y-4
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-2
                lt-sm-y-3
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-0
                lt-md-y-3
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-0
                lt-lg-y-2
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>8</h3>
            </div>
        </div><div draggable="true" class="lt
                lt-xs-x-1
                lt-xs-y-5
                lt-xs-w-1
                lt-xs-h-1
                lt-sm-x-2
                lt-sm-y-4
                lt-sm-w-1
                lt-sm-h-1
                lt-md-x-3
                lt-md-y-2
                lt-md-w-1
                lt-md-h-1
                lt-lg-x-3
                lt-lg-y-2
                lt-lg-w-1
                lt-lg-h-1">
            <div class="lt-body note">
                <h3>9</h3>
            </div>
        </div>
    </div>


