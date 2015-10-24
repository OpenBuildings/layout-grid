==================
Serialization demo
==================

You can load and set layout grid positions using the ltData jQuery function.

Loading positions is done with the ``$('#lt-grid').ltData(size)`` function where "size" is the size you want to load e.g. "xs", "sm", "md" or "lg".

Seting positions is done with ``$('#lt-grid').ltData(size, positions)``.

In this example you can load and set positions for the various sizes, where the current size is marked as a primary button.

.. raw:: html

    <div class="wy-control-group">
        <label for="result">
            Get
        </label>
        <div class="wy-control">
            <button
             class="btn btn-default btn-block"
             data-size="xs"
             onclick="$('#data').val(JSON.stringify($('#lt-grid').ltData('xs')))">
                xs
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="sm"
             onclick="$('#data').val(JSON.stringify($('#lt-grid').ltData('sm')))">
                sm
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="md"
             onclick="$('#data').val(JSON.stringify($('#lt-grid').ltData('md')))">
                md
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="lg"
             onclick="$('#data').val(JSON.stringify($('#lt-grid').ltData('lg')))">
                lg
            </button>
        </div>
    </div>

    <div class="wy-control-group">
        <label for="result">
            Set
        </label>
        <div class="wy-control">
            <button
             class="btn btn-default btn-block"
             data-size="xs"
             onclick="$('#lt-grid').ltData('xs', JSON.parse($('#data').val()))">
                xs
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="sm"
             onclick="$('#lt-grid').ltData('sm', JSON.parse($('#data').val()))">
                sm
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="md"
             onclick="$('#lt-grid').ltData('md', JSON.parse($('#data').val()))">
                md
            </button>
            <button
             class="btn btn-default btn-block"
             data-size="lg"
             onclick="$('#lt-grid').ltData('lg', JSON.parse($('#data').val()))">
                lg
            </button>
        </div>
    </div>

    <div class="wy-control-group">
        <label for="result">
            Serialized data
        </label>
        <div class="wy-control">
            <textarea id="data" rows="8"></textarea>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function(event) {
            var updateButtonLabels = function() {
                console.log($('#lt-grid').ltSize(), '[data-size='+ $('#lt-grid').ltSize() +']')
                $('[data-size]').removeClass('btn-primary')
                $('[data-size='+ $('#lt-grid').ltSize() +']').addClass('btn-primary')
            }

            updateButtonLabels();

            $(window).resize(updateButtonLabels)
        });
    </script>

    <div
     id="lt-grid"
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
