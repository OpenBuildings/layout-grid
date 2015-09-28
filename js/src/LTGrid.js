/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

 /* exported LTGrid */

var LTGrid = (function ($) {

    'use strict'

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME                = 'ltGrid'
    var DATA_KEY            = 'lt.grid'
    var EVENT_KEY           = '.' + DATA_KEY

    var Event = {
        START   : 'dragstart.' + EVENT_KEY + ' touchstart. ' + EVENT_KEY,
        OVER    : 'dragover.' + EVENT_KEY + ' touchmove. ' + EVENT_KEY,
        END     : 'dragend.' + EVENT_KEY + ' touchcancel. ' + EVENT_KEY,
        DROP    : 'drop.' + EVENT_KEY + ' touchend. ' + EVENT_KEY,
        LEAVE   : 'dragleave.' + EVENT_KEY
    }

    var Selector = {
        GRID   : '[data-arrange="lt-grid"]',
        WIDGET : '[data-arrange="lt-grid"] .lt'
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
                aspect: 2 / 3
            },
            md: {
                gap: 2,
                maxWidth: 1200,
                cols: 3,
                aspect: 2 / 3
            },
            sm: {
                gap: 3,
                maxWidth: 992,
                cols: 2,
                aspect: 2 / 3
            },
            xs: {
                gap: 4,
                maxWidth: 768,
                cols: 1,
                aspect: 2 / 3
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
    function LTGrid(element, options) {
        this.$element = $(element)
        this._options  = this._getOptions(options || {})
        this.$mask    = undefined
        this.$ghost   = undefined
    }

    // getters

    LTGrid.Default = Default

    LTGrid.NAME = NAME

    LTGrid.DATA_KEY = DATA_KEY

    LTGrid.EVENT_KEY = EVENT_KEY

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
        var modifiedClass = rect.setCss(this.$element.attr('class'), size)

        this.$element.attr('class', modifiedClass)
    }

    /**
     * Clear artefacts like mask and ghost and update
     */
    LTGrid.prototype.end = function () {
        this._removeMask()
        this._removeGhost()
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
     * Setter / getter of a Grid object for this Layout Grid
     *
     * @param  {String} size xs, sm, md or lg
     * @param  {Grid}   grid
     * @return {Grid}
     */
    LTGrid.prototype.grid = function (size, grid) {
        var $items = this.$element.children('[draggable]')

        if (undefined !== grid) {
            grid.rects.forEach(function (rect, index) {
                $items.eq(index)[LTRect.NAME](size, rect)
            })

            return this
        }

        return new Grid($.map($items.toArray(), function (item) {
            return $(item)[LTRect.NAME](size)
        }))
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
        var rect = $widget[LTRect.NAME](size)
        var grid = this.grid(size)

        if (this._options.overlap) {
            grid.update(rect, params)
        } else {
            grid.updateNoOverlap(rect, params)
        }

        this.grid(size, grid)
        this.update()
    }

    // private
    // ------------------------------------------------------------------------

    /**
     * Move the ghost element of a widget inside the grid.
     * Pass a mouse x and y coords, relative to the grid
     *
     * @param  {jQuery} $widget
     * @param  {Number} mouseX
     * @param  {Number} mouseY
     */
    LTGrid.prototype._moveGhost = function ($widget, mouseX, mouseY) {
        var size = this.size()
        var $ghost = this._getGhost($widget)
        var rect = $ghost[LTRect.NAME](size)
        var gap = this._options.params[size].gap
        var cols = this._options.params[size].cols

        rect.x = Math.floor(mouseX / (this._itemWidth(size) + gap))
        rect.y = Math.floor(mouseY / (this._itemHeight(size) + gap))

        rect.x = Math.min(Math.max(0, rect.x), cols - rect.w)

        $ghost[LTRect.NAME](size, rect)
    }

    /**
     * Return a ghost item for a widget, cache ghost
     *
     * @param  {jQuery} $widget
     * @return {jQuery}
     */
    LTGrid.prototype._getGhost = function ($widget) {
        if (undefined === this.$ghost) {
            this.$ghost = $('<div class="' + $widget.attr('class') + ' lt-ghost"></div>')
            this.$element.append(this.$ghost)
        }

        return this.$ghost
    }

    /**
     * Remove the ghost element for this grid
     *
     * @param  {jQuery} $widget
     */
    LTGrid.prototype._removeGhost = function () {
        if (this.$ghost) {
            this.$ghost.remove()
            this.$ghost = undefined
        }
    }

    /**
     * Move the widget to its corresponding ghost position
     *
     * @param  {jQuery} $widget
     */
    LTGrid.prototype._moveToGhost = function ($widget) {
        var size = this.size()
        var $parent = $widget.parent()
        var $ghost = this._getGhost($widget)
        var pos = $ghost[LTRect.NAME](size)

        this.$element.append($widget)

        this.reposition($widget, { x: pos.x, y: pos.y })

        $parent.add(this.$element)[NAME]('update')
    }

    /**
     * Get the mask of the grid. Create one if there is none.
     *
     * @return {jQuery}
     */
    LTGrid.prototype._getMask = function () {
        if (undefined === this.$mask) {
            this.$mask = $('<div class="lt-mask" data-lt-grid="mask"></div>')
            this.$element.append(this.$mask)
        }

        return this.$mask
    }

    /**
     * Remove the mask
     */
    LTGrid.prototype._removeMask = function () {
        if (undefined !== this.$mask) {
            this.$mask.remove()
            this.$mask = undefined
        }
    }

    /**
     * The width of a single grid count, in pixels
     *
     * @param  {String} size xs, sm, md or lg
     * @return {Number}
     */
    LTGrid.prototype._itemWidth = function (size) {
        var cols = this._options.params[size].cols
        var gap = this._options.params[size].gap

        return (this.$element.width() - (cols - 1) * gap) / cols
    }

    /**
     * The height of a single grid count, in pixels
     *
     * @param  {String} size xs, sm, md or lg
     * @return {Number}
     */
    LTGrid.prototype._itemHeight = function (size) {
        var aspect = this._options.params[size].aspect

        return this._itemWidth(size) * aspect
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

            if ($widget.length) {
                var pos = original.touches ? original.touches[0] : original
                var $this = $(this)
                var mouseX = pos.pageX - $this.offset().left
                var mouseY = pos.pageY - $this.offset().top
                var grid = $this[NAME]().data(DATA_KEY)

                event.preventDefault()

                grid._getMask()
                grid._moveGhost($widget, mouseX, mouseY)
            }
        })

        .on(Event.END, Selector.GRID, function () {
            $(this)[NAME]('end')
        })

        .on(Event.LEAVE, Selector.GRID, function (event) {
            event.preventDefault()

            if ($(event.target).data('lt-grid') === 'mask') {
                $(this)[NAME]('end')
            }
        })

        .on(Event.DROP, Selector.GRID, function (event) {
            var $widget = $(Store.get(event.originalEvent))

            if ($widget.length) {
                var $this = $(this)
                var grid = $this[NAME]().data(DATA_KEY)

                event.preventDefault()

                grid._moveToGhost($widget)
                grid.end()
            }
        })

    /**
    * ------------------------------------------------------------------------
    * jQuery
    * ------------------------------------------------------------------------
    */

    $.fn[NAME]        = LTGrid._jQueryInterface
    $.fn[NAME].LTGrid = LTGrid

    return LTGrid

})(jQuery)
