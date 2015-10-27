// LICENSE: BSD-3-Clause
// http://git.io/vZkLP

 var LTGrid = (function ($) {

'use strict'

/* exported Grid */

/**
 * A collection of rect objects
 */
var Grid = (function () {

    

    /**
     * @param  {Array}  rects array of Rect objects
     */
    function Grid(rects) {
        this.rects = rects || []
    }

    /**
     * Return all the rects that intersect with a given rect
     *
     * @param  {Rect} rect
     * @return {Array}
     */
    Grid.prototype.getIntersectingRects = function (rect) {
        return this.rects.filter(function (item) {
            return rect !== item && rect.intersect(item)
        })
    }

    /**
     * Reduce all the vertical whitespace between rects
     *
     * @return {Grid} self
     */
    Grid.prototype.compact = function () {
        var rectsCopy = this.rects.slice(0)
        var self = this

        rectsCopy
            .sort(function (a, b) {
                return a.y - b.y
            })
            .forEach(function (item) {
                do {
                    item.y -= 1
                } while (item.y >= 0 && self.getIntersectingRects(item).length === 0)

                item.y += 1
            })

        return this
    }

    /**
     * The maximum height of the rects in the grid
     *
     * @return {Number}
     */
    Grid.prototype.height = function () {
        var hights = this.rects.map(function (item) {
            return item.bottom()
        })

        return hights.length ? Math.max.apply(null, hights) : 0
    }

    /**
     * Call update() and if there is overlap move rects downards
     *
     * @param  {Rect}   rect   passed to update()
     * @param  {Object} params passed to update()
     * @return {Grid}          self
     */
    Grid.prototype.updateNoOverlap = function (rect, params) {

        var self = this

        this.update(rect, params)

        this.getIntersectingRects(rect)
            .forEach(function (item) {
                self.updateNoOverlap(item, { x: item.x, y: rect.bottom() })
            })

        return this
    }

    /**
     * Move a rect inside the grid, or update its size
     *
     * @param  {Rect}   rect
     * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
     * @return {Grid}          self
     */
    Grid.prototype.update = function (rect, params) {

        rect.x = ('x' in params) ? params.x : rect.x
        rect.y = ('y' in params) ? params.y : rect.y
        rect.w = ('w' in params) ? params.w : rect.w
        rect.h = ('h' in params) ? params.h : rect.h

        return this
    }

    return Grid
})()

/* exported LTData */

var LTData = (function ($) {

    

    var NAME     = 'ltData'

    var LTData = {
        NAME: NAME
    }

    LTData.getRects = function (rects) {
        return $.map(rects, function (rect) {
            return new Rect(rect.x, rect.y, rect.w, rect.h)
        })
    }

    /**
     * Getter / setter for rects data
     *
     * @param  {string} size    xs, sm, md or lg
     * @param  {Array} rects    Array of Rect objects
     */
    $.fn[NAME] = function (size, rects) {

        var ltGrid = this[LTGrid.NAME]().data(LTGrid.DATA_KEY)

        if (undefined !== rects) {
            ltGrid
                .grid(size, new Grid(LTData.getRects(rects)))
                .update()

            return this
        }

        return ltGrid.grid(size).rects
    }

    return LTData

})(jQuery)

/* exported LTGrid */

var LTGrid = (function ($) {

    

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME                = 'ltGrid'
    var DATA_KEY            = 'lt.grid'
    var EVENT_KEY           = '.' + DATA_KEY

    var Event = {
        UPDATE  : 'update',
        START   : 'dragstart' + EVENT_KEY + ' touchstart' + EVENT_KEY,
        OVER    : 'dragover' + EVENT_KEY + ' touchmove' + EVENT_KEY,
        END     : 'dragend' + EVENT_KEY + ' touchcancel' + EVENT_KEY,
        DROP    : 'drop' + EVENT_KEY + ' touchend' + EVENT_KEY,
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

        this.$element.trigger(Event.UPDATE)
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

/* exported LTGridOnly */

var LTGridOnly = (function ($) {

    

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME                = 'ltGridOnly'
    var DATA_KEY            = 'lt.grid-only'
    var EVENT_KEY           = '.' + DATA_KEY

    var Event = {
        CLICK   : 'click' + EVENT_KEY
    }

    var Css = {
        xs   : 'lt-only-xs',
        sm   : 'lt-only-sm',
        md   : 'lt-only-md',
        lg   : 'lt-only-lg'
    }

    var Selector = {
        TOGGLE   : '[data-toggle="lt-grid-only"]'
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
    function LTGridOnly(element, options) {
        this.$element = $(element)
        this.$target = $(options.target)[LTGrid.NAME]()
        this.ltGrid = this.$target.data(LTGrid.DATA_KEY)
    }

    // getters

    LTGridOnly.NAME = NAME

    LTGridOnly.DATA_KEY = DATA_KEY

    LTGridOnly.EVENT_KEY = EVENT_KEY

    // public

    /**
     * Save original params for later use
     */
    LTGridOnly.prototype.originalParams = function () {
        if (undefined === this.ltGrid.options().originalParams) {
            this.ltGrid.options().originalParams = this.ltGrid.options().params
        }

        return this.ltGrid.options().originalParams
    }

    /**
     * Compact the grid for current size
     * @param  {String} size
     */
    LTGridOnly.prototype.set = function (size) {
        var original = this.originalParams()
        var onlyClasses = $.map(
            Css,
            function (name) {
                return name
            }
        )

        this.$target.removeClass(onlyClasses.join(' '))

        if (size) {
            var params = {}
            params[size] = original[size]
            params[size].maxWidth = Number.MAX_VALUE

            this.$target.addClass(Css[size])
            this.ltGrid.option('params', params)
        } else {
            this.ltGrid.option('params', original)
        }
    }

    // static

    LTGridOnly._jQueryInterface = function (config, a1) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data(DATA_KEY)
            var _config = $.extend(
                true,
                {},
                $this.data(),
                typeof config === 'object' && config
            )

            if (!data) {
                data = new LTGridOnly(this, _config)
                $this.data(DATA_KEY, data)
            }

            if (typeof config === 'string') {
                data[config](a1)
            }
        })
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document)
        .on(Event.CLICK, Selector.TOGGLE, function (event) {
            var $item = $(event.target)

            $item[LTGridOnly.NAME]('set', $item.data('only'))
        })

    /**
    * ------------------------------------------------------------------------
    * jQuery
    * ------------------------------------------------------------------------
    */

    $.fn[NAME]            = LTGridOnly._jQueryInterface
    $.fn[NAME].LTGridOnly = LTGridOnly

    return LTGridOnly

})(jQuery)

/* exported LTRect */

var LTRect = (function ($) {

    

    var NAME     = 'ltRect'
    var DATA_KEY = 'lt.rect'

    var LTRect = {
        NAME: NAME,
        DATA_KEY: DATA_KEY
    }

    /**
     * Getter / setter for div element's rect.
     * Uses its css classes to laod the initial rect for a given size,
     * then caches in data.
     * Each screen size has its own rect
     *
     * @param  {string} size    xs, sm, md or lg
     * @param  {Rect}   newRect a Rect object to set
     * @return {jQuery}
     */
    $.fn[NAME] = function (size, newRect) {
        if (undefined === newRect) {
            if (undefined === this.data(DATA_KEY + size)) {
                this.data(DATA_KEY + size, (new Rect()).loadCss(this.attr('class'), size))
            }
            return this.data(DATA_KEY + size)
        }

        this.data(DATA_KEY + size, newRect)
        this.attr('class', newRect.setCss(this.attr('class'), size))

        return this
    }

    return LTRect

})(jQuery)

/* exported LTSize */

var LTSize = (function ($) {

    

    var NAME = 'ltSize'

    var LTSize = {
        NAME: NAME
    }

    /**
     * Get the current size of the grid
     */
    $.fn[NAME] = function () {
        return this[LTGrid.NAME]().data(LTGrid.DATA_KEY).size()
    }

    return LTSize

})(jQuery)

/* exported Rect */

/**
 * Object that represents a rectangle with many supporting methods
 */
var Rect = (function () {

    

    var paramNames = ['x', 'y', 'w', 'h']

    /**
     * @param  {Number} x default 0
     * @param  {Number} y default 0
     * @param  {Number} w width, default 1
     * @param  {Number} h height, default 1
     */
    function Rect(x, y, w, h) {
        this.x = x || 0
        this.y = y || 0
        this.w = w || 1
        this.h = h || 1
    }

    /**
     * @return {Number}
     */
    Rect.prototype.bottom = function () {
        return this.y + this.h
    }

    /**
     * @return {Number}
     */
    Rect.prototype.right = function () {
        return this.x + this.w
    }

    /**
     * Check if this rect is intersecting with another rect
     *
     * @param  {Rect} rect
     * @return {Boolean}
     */
    Rect.prototype.intersect = function (rect) {
        return this.x < rect.right() && this.right() > rect.x && this.y < rect.bottom() && this.bottom() > rect.y
    }

    /**
     * Modify a "css classes" string
     * with the pos and size of this rect,
     * for a specific screen size
     *
     * @param {String} classes html classes
     * @param {String} size    xs, sm, md or lg
     * @return {String}
     */
    Rect.prototype.setCss = function (classes, size) {
        var self = this

        paramNames.forEach(function (name) {
            classes = classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + self[name])
        })

        return classes
    }

    /**
     * Load data from "css classes", for a specific screen size
     *
     * @param {String} classes html classes
     * @param {String} size    xs, sm, md or lg
     */
    Rect.prototype.loadCss = function (classes, size) {
        var self = this

        paramNames.forEach(function (name) {
            var match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'))

            if (match) {
                self[name] = parseInt(match[1], 10)
            }
        })

        return this
    }

    return Rect
})()

/* exported Store */

/**
 * A class to store / retrieve element inside of dataTransfer object of an event
 * Fall back to a static variable if dataTransfer is not available
 */
var Store = (function () {

    

    var Store = {}

    /**
     * Genrate a time based random number
     *
     * @return {Number}
     */
    Store.getRandomNumber = function () {
        return Math.round(new Date().getTime() + (Math.random() * 100))
    }

    /**
     * Make sure the item has an id to quickly find it
     * Do not override existing ids
     *
     * @param  {Element} item
     * @return {String}
     */
    Store.getId = function (item) {
        if (!item.id) {
            item.id = 'lt-' + this.getRandomNumber()
        }

        return item.id
    }

    /**
     * Clear internal storage variable
     */
    Store.clear = function () {
        this.item = null
    }

    /**
     * Save the element
     *
     * @param {Event}    event
     * @param {Element}  item
     */
    Store.set = function (event, item) {

        this.item = JSON.stringify({
            LTWidget: this.getId(item)
        })

        if (event.dataTransfer) {
            event.dataTransfer.setData('text', this.item)
        }
    }

    /**
     * Retrieve stored element
     *
     * @param  {Event}   event
     * @return {Element}
     */
    Store.get = function (event) {
        var dataString = (event.dataTransfer && event.dataTransfer.getData('text')) || this.item

        if (dataString) {
            var data = JSON.parse(dataString)
            return document.getElementById(data.LTWidget)
        }
    }

    return Store
})()

LTGrid.Rect = Rect
LTGrid.Grid = Grid

return LTGrid

})(jQuery)
//# sourceMappingURL=layout-grid.js.map