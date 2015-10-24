.. title:: Admin Panel

================
Admin panel demo
================

This an example admin panel implementation.

You can configure all the positions for each size, by clicking on the size buttons. On each update the positions are copied over to hidden inputs, which you can then save normally.

.. raw:: html

    <p>
        <button
         class="btn btn-default btn-block"
         data-toggle="lt-grid-only"
         data-target="#admin-grid"
         type="button"
         data-only="xs">
            xs
        </button>
        <button
         class="btn btn-default btn-block"
         data-toggle="lt-grid-only"
         data-target="#admin-grid"
         type="button"
         data-only="sm">
            sm
        </button>
        <button
         class="btn btn-default btn-block"
         data-toggle="lt-grid-only"
         data-target="#admin-grid"
         type="button"
         data-only="md">
            md
        </button>
        <button
         class="btn btn-default btn-block"
         data-toggle="lt-grid-only"
         data-target="#admin-grid"
         type="button"
         data-only="lg">
            lg
        </button>
    </p>

    <form id="admin-form">
        <div
         id="admin-grid"
         data-arrange="lt-grid"
         class="lt-container
                lt-xs-h-6
                lt-sm-h-4
                lt-md-h-3
                lt-lg-h-2">

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

                    <input type="hidden" name="item[1][xs][x]" value=0 data-xs-x>
                    <input type="hidden" name="item[1][xs][y]" value=0 data-xs-y>

                    <input type="hidden" name="item[1][sm][x]" value=0 data-sm-x>
                    <input type="hidden" name="item[1][sm][y]" value=0 data-sm-y>

                    <input type="hidden" name="item[1][md][x]" value=0 data-md-x>
                    <input type="hidden" name="item[1][md][y]" value=0 data-md-y>

                    <input type="hidden" name="item[1][lg][x]" value=0 data-lg-x>
                    <input type="hidden" name="item[1][lg][y]" value=0 data-lg-y>

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

                    <input type="hidden" name="item[2][xs][x]" value=0 data-xs-x>
                    <input type="hidden" name="item[2][xs][y]" value=1 data-xs-y>

                    <input type="hidden" name="item[2][sm][x]" value=1 data-sm-x>
                    <input type="hidden" name="item[2][sm][y]" value=0 data-sm-y>

                    <input type="hidden" name="item[2][md][x]" value=2 data-md-x>
                    <input type="hidden" name="item[2][md][y]" value=0 data-md-y>

                    <input type="hidden" name="item[2][lg][x]" value=1 data-lg-x>
                    <input type="hidden" name="item[2][lg][y]" value=0 data-lg-y>

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

                    <input type="hidden" name="item[3][xs][x]" value=0 data-xs-x>
                    <input type="hidden" name="item[3][xs][y]" value=3 data-xs-y>

                    <input type="hidden" name="item[3][sm][x]" value=0 data-sm-x>
                    <input type="hidden" name="item[3][sm][y]" value=1 data-sm-y>

                    <input type="hidden" name="item[3][md][x]" value=1 data-md-x>
                    <input type="hidden" name="item[3][md][y]" value=0 data-md-y>

                    <input type="hidden" name="item[3][lg][x]" value=0 data-lg-x>
                    <input type="hidden" name="item[3][lg][y]" value=1 data-lg-y>

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

                    <input type="hidden" name="item[4][xs][x]" value=0 data-xs-x>
                    <input type="hidden" name="item[4][xs][y]" value=4 data-xs-y>

                    <input type="hidden" name="item[4][sm][x]" value=0 data-sm-x>
                    <input type="hidden" name="item[4][sm][y]" value=2 data-sm-y>

                    <input type="hidden" name="item[4][md][x]" value=0 data-md-x>
                    <input type="hidden" name="item[4][md][y]" value=1 data-md-y>

                    <input type="hidden" name="item[4][lg][x]" value=2 data-lg-x>
                    <input type="hidden" name="item[4][lg][y]" value=0 data-lg-y>

                </div>
            </div>
        </div>

        <div class="wy-control-group">
            <label for="result">
                Save inputs
                <small> visualize input data </small>
            </label>
            <div class="wy-control">
                <textarea
                 id="result"
                 name="result"
                 rows="7"></textarea>
            </div>
        </div>

        <p>
            <button
             type="submit"
             class="btn">
                Save
            </button>
        </p>
    </form>

The javascript needed for this form to work is this: (in the ``admin-demo.js`` file)

.. code-block:: javascript

    $(function () {
        $('#admin-form').on('submit', function (event) {
            event.preventDefault()

            $('#result').val(decodeURIComponent($('#form').serialize()))
        })

        $('#admin-grid').on('update', function () {
            $('#admin-grid .lt').each(function () {
                $(this).find('[data-xs-x]').val($(this).ltRect('xs').x)
                $(this).find('[data-xs-y]').val($(this).ltRect('xs').y)

                $(this).find('[data-sm-x]').val($(this).ltRect('sm').x)
                $(this).find('[data-sm-y]').val($(this).ltRect('sm').y)

                $(this).find('[data-md-x]').val($(this).ltRect('md').x)
                $(this).find('[data-md-y]').val($(this).ltRect('md').y)

                $(this).find('[data-lg-x]').val($(this).ltRect('lg').x)
                $(this).find('[data-lg-y]').val($(this).ltRect('lg').y)

            })
        })
    })
