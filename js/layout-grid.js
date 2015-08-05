/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */
+function ($, undefined) {
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

        return hights ? Math.max.apply(null, hights) : 0;
    };

    /**
     * Move a rect inside the grid
     * If there is overlap move rects downards
     * @param  {Rect} rect
     * @param  {integer} x
     * @param  {integer} y
     */
    Grid.prototype.moveNoOverlap = function (rect, x, y) {
        var self = this;

        this.move(rect, x, y);

        $.each(this.getIntersectingRects(rect), function () {
            self.moveNoOverlap(this, this.x, rect.bottom());
        });

        return this;
    };

    /**
     * Move a rect inside the grid
     * If there is overlap move rects downards
     * @param  {Rect} rect
     * @param  {integer} x
     * @param  {integer} y
     */
    Grid.prototype.move = function (rect, x, y) {
        var self = this;

        rect.x = x;
        rect.y = y;

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
            },
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

    /**
     * Get the current screen size
     * @return {string} xs, sm, md or lg
     */
    LTGrid.prototype.size = function () {
        var currentSize;
        var windowWidth = $(window).width();

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
     * Clear artefacts like mask and ghost
     */
    LTGrid.prototype.end = function () {
        this.removeMask();
        this.removeGhost();

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
     * @param  {integer} x
     * @param  {integer} y
     */
    LTGrid.prototype.reposition = function ($widget, x, y) {
        var size = this.size();
        var rect = $widget.lt_rect(size);
        var grid = this.grid(size);

        if (this.options.overlap) {
            grid.move(rect, x, y);
        } else {
            grid.moveNoOverlap(rect, x, y);
        }

        this.grid(size, grid);
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

        this.reposition($widget, pos.x, pos.y);

        $parent.add(this.$element).lt_grid('end');
    };

    // LAYOUT GRID PLUGIN DEFINITION
    // =============================

    function Plugin(option, param1, param2, param3) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('cl.lt_grid');
            var options = $.extend(true, {}, LTGrid.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('cl.lt_grid', (data = new LTGrid(this, options)));
            if (typeof option == 'string') data[option](param1, param2, param3);
        });
    }

    $.fn.lt_grid             = Plugin;
    $.fn.lt_grid.Constructor = LTGrid;
    $.lt = {
        Grid: Grid,
        Rect: Rect
    };

    // LAYOUT GRID DATA-API
    // ====================

    $(document)
        .on('dragstart.layout-grid.data-api', '[data-arrange="layout-grid"] .lt', function (event) {
            var data = JSON.stringify({
                LTWidget: '#' + $(this).lt_ensure_id().attr('id'),
            });

            $.lt.currentEventData = data;

            event.originalEvent.dataTransfer.setData('text/plain', data);
        })

        .on('dragover.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            var $this = $(this);
            var dataString = event.originalEvent.dataTransfer.getData('text/plain') || $.lt.currentEventData;

            if (dataString) {
                var data = JSON.parse(dataString);

                var mouseX = event.originalEvent.clientX + $(window).scrollLeft() - $this.offset().left;
                var mouseY = event.originalEvent.clientY + $(window).scrollTop() - $this.offset().top;

                if (data && data.LTWidget) {
                    event.preventDefault();

                    $this
                        .lt_grid('mask')
                        .lt_grid('moveGhost', $(data.LTWidget),  mouseX, mouseY);
                }
            }

        })

        .on('dragend.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            $(this).lt_grid('end');
        })

        .on('dragleave.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault();
        })

        .on('dragleave.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault();

            // We need to have a mask because of the event bubbling does not allow for a nice "do stuff on dragleave"
            if ($(event.target).data('lt-grid') =='mask') {
                $(this).lt_grid('end');
            }
        })

        .on('drop.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            var data = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));

            if (data && data.LTWidget) {

                event.preventDefault();

                $(this)
                    .lt_grid('moveToGhost', $(data.LTWidget))
                    .lt_grid('end');
            }
        });

}(jQuery);
