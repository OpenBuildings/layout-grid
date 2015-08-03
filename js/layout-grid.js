/* Layout Grid
 *
 * Allows dragging/dropping items in the grid, automatically rearanging it.
 */

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
    Grid.prototype.move = function (rect, x, y) {
        var self = this;

        rect.x = x;
        rect.y = y;

        $.each(this.getIntersectingRects(rect), function () {
            self.move(this, this.x, rect.bottom());
        });

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

    var LTGrid = function (element) {
        this.$element = $(element);
        this.overlap = this.$element.data('overlap') || false;
        this.options = $.extend(
            {
                xs: {
                    gap: 4,
                    maxWidth: 768,
                    cols: 1,
                    aspect: 2/3
                },
                sm: {
                    gap: 3,
                    maxWidth: 992,
                    cols: 2,
                    aspect: 2/3
                },
                md: {
                    gap: 2,
                    maxWidth: 1200,
                    cols: 3,
                    aspect: 2/3
                },
                lg: {
                    gap: 1,
                    maxWidth: Number.MAX_VALUE,
                    cols: 4,
                    aspect: 2/3
                },
            },
            this.$element.data('options') || {}
        );
    };

    LTGrid.prototype.size = function() {
        var currentSize;
        var windowWidth = $(window).width();

        $.each(this.options, function (size, sizeOptions) {
            if (windowWidth < sizeOptions.maxWidth) {
                currentSize = size;
            }
        });

        return currentSize;
    };

    LTGrid.prototype.add_ghost = function ($item) {
        this.$ghost = $('<div class="' + $item.attr('class') + ' lt-ghost"></div>');
        this.$dragged = $item.addClass('lt-dragged');
        this.$element.append(this.$ghost);
    };

    LTGrid.prototype.remove_ghost = function () {
        this.$dragged.removeClass('lt-dragged');
        this.$ghost.remove();
    };

    LTGrid.prototype.resize = function () {
        var size = this.size();
        var rect = new Rect(0, 0, 0, this.grid().height());

        this.$element.attr(
            'class',
            rect.setCss(this.$element.attr('class'), size)
        );
    };

    LTGrid.prototype.move_ghost = function (mouseX, mouseY) {
        var size = this.size();
        var rect = this.$ghost.lt_rect(size);
        var width = (this.$element.width() - (this.options[size].cols - 1) * this.options[size].gap) / this.options[size].cols;
        var height = width * this.options[size].aspect;

        rect.x = Math.floor(mouseX / (width + this.options[size].gap));
        rect.y = Math.floor(mouseY / (height + this.options[size].gap));

        rect.x = Math.min(Math.max(0, rect.x), this.options[size].cols - rect.w);

        this.$ghost.lt_rect(size, rect);
    };

    LTGrid.prototype.grid = function (grid) {
        var size = this.size();
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

    LTGrid.prototype.reposition = function (item, x, y) {
        var size = this.size();
        var rect = item.lt_rect(size);
        var grid = this.grid();

        grid
            .move(rect, x, y)
            .compact();

        this.grid(grid);
        this.resize();
    };

    LTGrid.prototype.move_dragged = function () {
        var size = this.size();
        var pos = this.$ghost.lt_rect(size);

        if (false === this.overlap) {
            this.reposition(this.$dragged, pos.x, pos.y);
        }
    };

    // LAYOUT GRID PLUGIN DEFINITION
    // =============================

    function Plugin(option, param1, param2) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('cl.lt_grid');

            if (!data) $this.data('cl.lt_grid', (data = new LTGrid(this)));
            if (typeof option == 'string') data[option](param1, param2);
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
            var $this = $(this);

            event.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({
                LTWidget: $this.attr('id'),
            }));

            $this.parent().lt_grid('add_ghost', $this);
        })
        .on('dragover.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            var $this = $(this);
            var data = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));

            var mouseX = event.originalEvent.clientX + $(window).scrollLeft() - $this.position().left;
            var mouseY = event.originalEvent.clientY + $(window).scrollTop() - $this.position().top;

            event.preventDefault();

            $this.lt_grid('move_ghost', mouseX, mouseY);
        })
        .on('dragend.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            $(this).lt_grid('remove_ghost');
        })
        .on('dragleave.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault();
        })
        .on('drop.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault();
            $(this).lt_grid('move_dragged');
        });

}(jQuery);
