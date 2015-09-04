/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */
(function ($, undefined) {
    'use strict';

    /**
     * Object that represents a rectangle with many supporting methods
     * @param {integer} x horizontal position (starts with 0)
     * @param {integer} y vertical position (starts with 0)
     * @param {integer} w width (starts with 1)
     * @param {integer} h height (starts with 1)
     */
    var Rect = function (x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
    };

    /**
     * @return {integer}
     */
    Rect.prototype.bottom = function () {
        return this.y + this.h;
    };

    /**
     * @return {integer}
     */
    Rect.prototype.right = function () {
        return this.x + this.w;
    };

    /**
     * Check if this rect is intersecting with another rect
     *
     * @param {Rect} rect
     * @return {boolean}
     */
    Rect.prototype.intersect = function (rect) {
        return this.x < rect.right() && this.right() > rect.x && this.y < rect.bottom() && this.bottom() > rect.y;
    };

    /**
     * Modify a "css classes" string
     * with the pos and size of this rect,
     * for a specific screen size
     *
     * @param {string} classes html classes
     * @param {string} size    xs, sm, md or lg
     */
    Rect.prototype.setCss = function (classes, size) {
        var self = this;

        ['x', 'y', 'w', 'h'].forEach(function (name) {
            classes = classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + self[name]);
        });

        return classes;
    };

    /**
     * Load data from "css classes", for a specific screen size
     *
     * @param {string} classes html classes
     * @param {string} size    xs, sm, md or lg
     */
    Rect.prototype.loadCss = function (classes, size) {
        var self = this;

        ['x', 'y', 'w', 'h'].forEach(function (name) {
            var match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'));

            if (match) {
                self[name] = parseInt(match[1]);
            }
        });

        return this;
    };


    /**
     * A collection of rect objects
     * @param {array} rects array of Rect objects
     */
    var Grid = function (rects) {
        this.rects = rects || [];
    };

    /**
     * Return all the rects that intersect with a given rect
     * @param  {Rect}   rect
     * @return {array}
     */
    Grid.prototype.getIntersectingRects = function (rect) {
        return $.grep(this.rects, function (item) {
            return rect !== item && rect.intersect(item);
        });
    };

    /**
     * Reduce all the vertical whitespace between rects
     */
    Grid.prototype.compact = function () {
        var self = this;
        var sorted = this.rects.slice(0).sort(function (a, b){
            return a.y - b.y;
        });

        $.each(sorted, function () {
            do {
                this.y -= 1;
            } while (this.y >= 0 && self.getIntersectingRects(this).length === 0);

            this.y += 1;
        });

        return this;
    };

    /**
     * The maximum height of the rects in the grid
     * @return {integer}
     */
    Grid.prototype.height = function () {
        var hights = $.map(
            this.rects,
            function (item) {
                return item.bottom();
            }
        );

        return hights.length ? Math.max.apply(null, hights) : 0;
    };

    /**
     * Move a rect inside the grid, or update its size
     * If there is overlap move rects downards
     * @param  {Rect} rect
     * @param  {object} params An object with optional keys x, y, w, h to modify the rect
     */
    Grid.prototype.updateNoOverlap = function (rect, params) {
        var self = this;

        this.update(rect, params);

        $.each(this.getIntersectingRects(rect), function () {
            self.updateNoOverlap(this, {x: this.x, y: rect.bottom()});
        });

        return this;
    };

    /**
     * Move a rect inside the grid, or update its size
     * @param  {Rect} rect
     * @param  {object} params An object with optional keys x, y, w, h to modify the rect
     */
    Grid.prototype.update = function (rect, params) {

        rect.x = ('x' in params) ? params.x : rect.x;
        rect.y = ('y' in params) ? params.y : rect.y;
        rect.w = ('w' in params) ? params.w : rect.w;
        rect.h = ('h' in params) ? params.h : rect.h;

        return this;
    };

    /**
     * Getter / setter for div element's rect.
     * Uses its css classes to laod the initial rect for a given size,
     * then caches in data.
     * Each screen size has its own rect
     *
     * @param  {string} size    xs, sm, md or lg
     * @param  {Rect}   newRect a Rect object to set
     * @return {Rect}
     */
    $.fn.lt_rect = function (size, newRect) {
        if (undefined === newRect) {
            if (undefined === this.data('lt-item-' + size)) {
                this.data('lt-item-' + size, (new Rect()).loadCss(this.attr('class'), size));
            }
            return this.data('lt-item-' + size);
        }

        this.data('lt-item-' + size, newRect);
        this.attr('class', newRect.setCss(this.attr('class'), size));

        return this;
    };

    /**
     * Make sure the item has an id to quickly find it
     * Do not override existing ids
     */
    $.fn.lt_ensure_id = function () {
        this
            .filter(function () { return ! this.id; })
            .each(function () {
                this.id = 'rect-' + Math.round(new Date().getTime() + (Math.random() * 100));
            });

        return this;
    };


    /**
     * Get the current size of the grid
     */
    $.fn.lt_size = function () {
        return this.lt_grid().data('lt-grid').size();
    };

    function saveWidget (event, $widget) {
        var data = JSON.stringify({
            LTWidget: '#' + $widget.lt_ensure_id().attr('id')
        });

        $.lt.currentEventData = data;

        if (event.originalEvent.dataTransfer) {
            event.originalEvent.dataTransfer.setData('text', data);
        }
    }

    function loadWidget (event) {
        var dataString = (event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.getData('text')) || $.lt.currentEventData;

        if (dataString) {
            var data = JSON.parse(dataString);
            return $(data.LTWidget);
        }
    }

    var LTGrid = function (element, options) {
        this.$element = $(element);
        this.$ghost = null;
        this.$mask = null;
        this.options = options;
    };

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

    /**
     * Update an option directly
     *
     * @param  {string} name
     * @param  {mixed} value
     */
    LTGrid.prototype.option = function (name, value) {
        this.options[name] = value;
    };

    LTGrid.prototype.windowWidth = function () {
        return $(window).width();
    };

    /**
     * Get the current screen size
     * @return {string} xs, sm, md or lg
     */
    LTGrid.prototype.size = function () {
        var currentSize;
        var windowWidth = this.windowWidth();

        $.each(this.options.params, function (size, sizeOptions) {
            if (windowWidth < sizeOptions.maxWidth) {
                currentSize = size;
            }
        });

        return currentSize;
    };

    /**
     * Return a ghost item for a widget, cache ghost
     *
     * @param  {jQuery} $widget
     * @return {jQuery}
     */
    LTGrid.prototype.ghost = function ($widget) {
        if (null === this.$ghost) {
            this.$ghost = $('<div class="' + $widget.attr('class') + ' lt-ghost"></div>');
            this.$element.append(this.$ghost);
        }

        return this.$ghost;
    };

    /**
     * Remove the ghost element for this grid
     * @param  {jQuery} $widget
     */
    LTGrid.prototype.removeGhost = function () {
        if (this.$ghost) {
            this.$ghost.remove();
            this.$ghost = null;
        }
    };

    /**
     * Compact the grid for current size
     */
    LTGrid.prototype.compact = function () {
        var size = this.size();

        this.grid(size, this.grid(size).compact());
    };

    /**
     * Resize container to match items
     */
    LTGrid.prototype.resize = function () {
        var size = this.size();
        var rect = new Rect(0, 0, 0, this.grid(size).height());

        this.$element.attr(
            'class',
            rect.setCss(this.$element.attr('class'), size)
        );
    };

    /**
     * The width of a single grid count, in pixels
     * @param  {string} size xs, sm, md or lg
     * @return {integer}
     */
    LTGrid.prototype.itemWidth = function (size) {
        return (this.$element.width() - (this.options.params[size].cols - 1) * this.options.params[size].gap) / this.options.params[size].cols;
    };

    /**
     * The height of a single grid count, in pixels
     * @param  {string} size xs, sm, md or lg
     * @return {integer}
     */
    LTGrid.prototype.itemHeight = function (size) {
        return this.itemWidth(size) * this.options.params[size].aspect;
    };

    /**
     * Move the ghost element of a widget inside the grid.
     * Pass a mouse x and y coords, relative to the grid
     * @param  {jQuery} $widget
     * @param  {integer} mouseX
     * @param  {integer} mouseY
     */
    LTGrid.prototype.moveGhost = function ($widget, mouseX, mouseY) {
        var size = this.size();
        var $ghost = this.ghost($widget);
        var rect = $ghost.lt_rect(size);

        rect.x = Math.floor(mouseX / (this.itemWidth(size) + this.options.params[size].gap));
        rect.y = Math.floor(mouseY / (this.itemHeight(size) + this.options.params[size].gap));

        rect.x = Math.min(Math.max(0, rect.x), this.options.params[size].cols - rect.w);

        $ghost.lt_rect(size, rect);
    };

    /**
     * Clear artefacts like mask and ghost and update
     */
    LTGrid.prototype.end = function () {
        this.removeMask();
        this.removeGhost();
        this.update();
    };

    /**
     * Call resize and compact if allowed
     */
    LTGrid.prototype.update = function () {

        if (this.options.compact) {
            this.compact();
        }

        if (this.options.resize) {
            this.resize();
        }
    };

    /**
     * Get the mask of the grid. Create one if there is none.
     * @return {jQuery}
     */
    LTGrid.prototype.mask = function () {
        if (null === this.$mask) {
            this.$mask = $('<div class="lt-mask" data-lt-grid="mask"></div>');
            this.$element.append(this.$mask);
        }

        return this.$mask;
    };

    /**
     * Remove the mask
     */
    LTGrid.prototype.removeMask = function () {
        if (null !== this.$mask) {
            this.$mask.remove();
            this.$mask = null;
        }
    };

    /**
     * Setter / getter of a Grid object for this Layout Grid
     * @param  {Grid} grid
     * @return {Grid}
     */
    LTGrid.prototype.grid = function (size, grid) {
        var $items = this.$element.children('[draggable]');

        if (undefined === grid) {
            return new Grid($.map($items.toArray(), function (item) {
                return $(item).lt_rect(size);
            }));
        } else {
            $.each(grid.rects, function (index, item) {
                $items.eq(index).lt_rect(size, item);
            });
        }
    };

    /**
     * Move a widget within the grid, repositioning other elements
     * so there is no overlapping
     * @param  {jQuery} $widget
     * @param  {object} params An object with optional keys x, y, w, h to modify the rect
     */
    LTGrid.prototype.reposition = function ($widget, params) {
        var size = this.size();
        var rect = $widget.lt_rect(size);
        var grid = this.grid(size);

        if (this.options.overlap) {
            grid.update(rect, params);
        } else {
            grid.updateNoOverlap(rect, params);
        }

        this.grid(size, grid);
        this.update();
    };

    /**
     * Move the widget to its corresponding ghost position
     * @param  {jQuery} $widget
     */
    LTGrid.prototype.moveToGhost = function ($widget) {
        var size = this.size();
        var $parent = $widget.parent();
        var $ghost = this.ghost($widget);
        var pos = $ghost.lt_rect(size);

        this.$element.append($widget);

        this.reposition($widget, {x: pos.x, y: pos.y});

        $parent.add(this.$element).lt_grid('update');
    };

    // LAYOUT GRID PLUGIN DEFINITION
    // =============================

    function Plugin(option, param1, param2, param3) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('lt-grid');
            var options = $.extend(true, {}, LTGrid.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('lt-grid', (data = new LTGrid(this, options)));
            }

            if (typeof option === 'string') {
                data[option](param1, param2, param3);
            }
        });
    }

    $.fn.lt_grid             = Plugin;
    $.fn.lt_grid.Constructor = LTGrid;
    $.lt = {
        Grid: Grid,
        Rect: Rect,
        saveWidget: saveWidget,
        loadWidget: loadWidget
    };

    // LAYOUT GRID DATA-API
    // ====================

    $(document)
        .on('dragstart.lt touchstart.lt', '[data-arrange="layout-grid"] .lt', function (event) {
            saveWidget(event, $(this));
        })

        .on('dragover.lt touchmove.lt', '[data-arrange="layout-grid"]', function (event) {
            var $widget = loadWidget(event);
            var $this = $(this);

            if ($widget) {
                var pos = event.originalEvent.touches ? event.originalEvent.touches[0] : event.originalEvent;
                var mouseX = pos.pageX - $this.offset().left;
                var mouseY = pos.pageY - $this.offset().top;

                event.preventDefault();

                $this
                    .lt_grid('mask')
                    .lt_grid('moveGhost', $widget,  mouseX, mouseY);
            }
        })

        .on('dragend.lt touchcancel.lt', '[data-arrange="layout-grid"]', function () {
            $(this).lt_grid('end');
        })

        .on('dragleave.lt', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault();

            if ($(event.target).data('lt-grid') === 'mask') {
                $(this).lt_grid('end');
            }
        })

        .on('drop.lt touchend.lt', '[data-arrange="layout-grid"]', function (event) {
            var $widget = loadWidget(event);

            if ($widget) {
                event.preventDefault();

                $(this)
                    .lt_grid('moveToGhost', $widget)
                    .lt_grid('end');
            }
        });

}(jQuery));
