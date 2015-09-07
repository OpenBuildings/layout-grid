/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

'use strict';

var LTGrid = (function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME                = 'lt_grid'
    var DATA_KEY            = 'lt.grid'
    var EVENT_KEY           = '.' + DATA_KEY
    var DATA_API_KEY        = '.data-api'

    var Event = {
        START   : "dragstart." + EVENT_KEY + " touchstart. " + EVENT_KEY,
        OVER    : "dragover." + EVENT_KEY + " touchmove. " + EVENT_KEY,
        END     : "dragend." + EVENT_KEY + " touchcancel. " + EVENT_KEY,
        DROP    : "drop." + EVENT_KEY + " touchend. " + EVENT_KEY,
        LEAVE   : "dragleave." + EVENT_KEY
    }

    var Selector = {
        GRID   : '[data-arrange="layout-grid"]',
        WIDGET : '[data-arrange="layout-grid"] .lt'
    }

    var Default = {
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
    }


    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    /**
     * @param  {jQuery} element
     * @param  {Object} options
     */
    function LTGrid (element, options) {
        this._element = $(element)
        this._options  = this._getOptions(options || {})
        this._mask    = null
        this._ghost   = null
    }

    // getters

    LTGrid.Default = Default;

    LTGrid.DATA_KEY = DATA_KEY;

    LTGrid.prototype.options = function () {
        return this._options
    }

    // public

    /**
     * Update an option directly
     *
     * @param  {String} name
     * @param  {mixed} value
     */
    LTGrid.prototype.option = function (name, value) {
        this._options[name] = value
    }

    /**
     * Get the current screen size
     * @return {String} xs, sm, md or lg
     */
    LTGrid.prototype.size = function () {
        var currentSize
        var windowWidth = this._windowWidth()

        for (var size in this._options.params) {
            if (windowWidth < this._options.params[size].maxWidth) {
                currentSize = size
            }
        }

        return currentSize
    }

    /**
     * Return a ghost item for a widget, cache ghost
     *
     * @param  {jQuery} $widget
     * @return {jQuery}
     */
    LTGrid.prototype.ghost = function ($widget) {
        if (null === this._ghost) {
            this._ghost = $('<div class="' + $widget.attr('class') + ' lt-ghost"></div>')
            this._element.append(this._ghost)
        }

        return this._ghost
    }

    /**
     * Remove the ghost element for this grid
     *
     * @param  {jQuery} $widget
     */
    LTGrid.prototype.removeGhost = function () {
        if (this._ghost) {
            this._ghost.remove()
            this._ghost = null
        }
    }


    /**
     * Compact the grid for current size
     */
    LTGrid.prototype.compact = function () {
        var size = this.size()
        var grid = this.grid(size)

        this.grid(size, grid.compact())
    }

    /**
     * Resize container to match items
     */
    LTGrid.prototype.resize = function () {
        var size = this.size()
        var rect = new Rect(0, 0, 0, this.grid(size).height())
        var modifiedClass = rect.setCss(this._element.attr('class'), size)

        this._element.attr('class', modifiedClass)
    }

    /**
     * Move the ghost element of a widget inside the grid.
     * Pass a mouse x and y coords, relative to the grid
     *
     * @param  {jQuery} $widget
     * @param  {Number} mouseX
     * @param  {Number} mouseY
     */
    LTGrid.prototype.moveGhost = function ($widget, mouseX, mouseY) {
        var size = this.size()
        var $ghost = this.ghost($widget)
        var rect = $ghost.lt_rect(size)
        var gap = this._options.params[size].gap
        var cols = this._options.params[size].cols

        rect.x = Math.floor(mouseX / (this._itemWidth(size) + gap))
        rect.y = Math.floor(mouseY / (this._itemHeight(size) + gap))

        rect.x = Math.min(Math.max(0, rect.x), cols - rect.w)

        $ghost.lt_rect(size, rect)
    }

    /**
     * Clear artefacts like mask and ghost and update
     */
    LTGrid.prototype.end = function () {
        this.removeMask()
        this.removeGhost()
        this.update()
    }

    /**
     * Call resize and compact if allowed
     */
    LTGrid.prototype.update = function () {
        if (this._options.compact) {
            this.compact()
        }

        if (this._options.resize) {
            this.resize()
        }
    }

    /**
     * Get the mask of the grid. Create one if there is none.
     *
     * @return {jQuery}
     */
    LTGrid.prototype.mask = function () {
        if (null === this._mask) {
            this._mask = $('<div class="lt-mask" data-lt-grid="mask"></div>');
            this._element.append(this._mask);
        }

        return this._mask;
    }

    /**
     * Remove the mask
     */
    LTGrid.prototype.removeMask = function () {
        if (null !== this._mask) {
            this._mask.remove()
            this._mask = null
        }
    }

    /**
     * Setter / getter of a Grid object for this Layout Grid
     *
     * @param  {String} size xs, sm, md or lg
     * @param  {Grid}   grid
     * @return {Grid}
     */
    LTGrid.prototype.grid = function (size, grid) {
        var $items = this._element.children('[draggable]')

        if (undefined === grid) {
            return new Grid($.map($items.toArray(), function (item) {
                return $(item).lt_rect(size)
            }))
        } else {
            for (var index in grid.rects) {
                $items.eq(index).lt_rect(size, grid.rects[index])
            }
        }
    }

    /**
     * Move a widget within the grid, repositioning other elements
     * so there is no overlapping
     *
     * @param  {jQuery} $widget
     * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
     */
    LTGrid.prototype.reposition = function ($widget, params) {
        var size = this.size()
        var rect = $widget.lt_rect(size)
        var grid = this.grid(size)

        if (this._options.overlap) {
            grid.update(rect, params);
        } else {
            grid.updateNoOverlap(rect, params);
        }

        this.grid(size, grid)
        this.update()
    }

    /**
     * Move the widget to its corresponding ghost position
     *
     * @param  {jQuery} $widget
     */
    LTGrid.prototype.moveToGhost = function ($widget) {
        var size = this.size()
        var $parent = $widget.parent()
        var $ghost = this.ghost($widget)
        var pos = $ghost.lt_rect(size)

        this._element.append($widget)

        this.reposition($widget, {x: pos.x, y: pos.y})

        $parent.add(this._element).lt_grid('update')
    }


    // private

    /**
     * The width of a single grid count, in pixels
     *
     * @param  {String} size xs, sm, md or lg
     * @return {Number}
     */
    LTGrid.prototype._itemWidth = function (size) {
        var cols = this._options.params[size].cols
        var gap = this._options.params[size].gap

        return (this._element.width() - (cols - 1) * gap) / cols
    }

    /**
     * The height of a single grid count, in pixels
     *
     * @param  {String} size xs, sm, md or lg
     * @return {Number}
     */
    LTGrid.prototype._itemHeight = function (size) {
        var aspect = this._options.params[size].aspect

        return this._itemWidth(size) * aspect;
    }

    /**
     * Return the current window width
     *
     * @return {Number}
     */
    LTGrid.prototype._windowWidth = function () {
        return $(window).width()
    }

    LTGrid.prototype._getOptions = function (options) {
        return $.extend(true, {}, Default, options)
    }

    // static

    LTGrid._jQueryInterface = function (config, a1, a2, a3) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data(DATA_KEY)
            var _config = $.extend(
                true,
                {},
                Default,
                $this.data(),
                typeof config === 'object' && config
            )

            if (!data) {
                data = new LTGrid(this, _config)
                $this.data(DATA_KEY, data)
            }

            if (typeof config === 'string') {
                data[config](a1, a2, a3)
            }
        })
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document)
        .on(Event.START, Selector.WIDGET, function (event) {
            Store.set(event.originalEvent, this)
        })

        .on(Event.OVER, Selector.GRID, function (event) {
            var original = event.originalEvent
            var $widget = $(Store.get(original))
            var $this = $(this)

            if ($widget.length) {
                var pos = original.touches ? original.touches[0] : original
                var mouseX = pos.pageX - $this.offset().left
                var mouseY = pos.pageY - $this.offset().top

                event.preventDefault()

                $this
                    .lt_grid('mask')
                    .lt_grid('moveGhost', $widget,  mouseX, mouseY)
            }
        })

        .on(Event.END, Selector.GRID, function () {
            $(this).lt_grid('end')
        })

        .on(Event.LEAVE, Selector.GRID, function (event) {
            event.preventDefault()

            if ($(event.target).data('lt-grid') === 'mask') {
                $(this).lt_grid('end')
            }
        })

        .on(Event.DROP, Selector.GRID, function (event) {
            var $widget = $(Store.get(event.originalEvent))

            if ($widget.length) {
                event.preventDefault()

                $(this)
                    .lt_grid('moveToGhost', $widget)
                    .lt_grid('end')
            }
        });

    /**
    * ------------------------------------------------------------------------
    * jQuery
    * ------------------------------------------------------------------------
    */

    $.fn[NAME]        = LTGrid._jQueryInterface
    $.fn[NAME].LTGrid = LTGrid

    return LTGrid

})(jQuery);
