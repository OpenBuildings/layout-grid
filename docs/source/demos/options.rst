=========================
Configurable options demo
=========================

Modify options on the fly or set them as data attributes

You can use ``data-overlap="..."`` to allow or deny overlapping (defaults to false), ``data-compact="..."`` to reduce vertical space as much as possible (defaults to true) or ``data-resize=".."`` to resize the whole container to match its contents. This can also be done on the fly by using the ``option()`` method e.g. ``$(...).ltGrid('option', 'overlap', true)``

Here's how it looks in action:

.. raw:: html

    <div class="highlight">
    <pre class="code">
    <span class="nt">&lt;div</span>
        <span class="na">data-arrange=</span><span class="s">"layout-grid"</span>
        <span class="na">data-overlap=</span><span class="s">"<strong id="data-overlap">false</strong>"</span>
        <span class="na">data-compact=</span><span class="s">"<strong id="data-compact">true</strong>"</span>
        <span class="na">data-resize=</span><span class="s">"<strong id="data-resize">true</strong>"</span><span class="nt">&gt;</span>
    <span class="nt">&lt;/div&gt;</span></pre>
    </div>

    <div class="wy-control-group">
        <label>Dynamically toggle options</label>
        <div class="wy-control">
            <label class="wy-checkbox">
                <input
                 type="checkbox"
                 onchange="$('#lt-grid').ltGrid('option', 'overlap', this.checked); $('#data-overlap').text(this.checked.toString());">
                Allow overlap on items when reordering
            </label>

            <label class="wy-checkbox">
                <input
                 type="checkbox"
                 checked
                 onchange="$('#lt-grid').ltGrid('option', 'compact', this.checked); $('#data-compact').text(this.checked.toString());">
                Compact items after reorder, by reducing horizontal space
            </label>

            <label class="wy-checkbox">
                <input
                 type="checkbox"
                 checked
                 onchange="$('#lt-grid').ltGrid('option', 'resize', this.checked); $('#data-resize').text(this.checked.toString());">
                Resize the container after reorder to encompass all items
            </label>
        </div>
    </div>

    <div
     id="lt-grid"
     data-arrange="layout-grid"
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
