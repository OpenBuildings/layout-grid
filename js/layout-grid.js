/* Layout Grid
 *
 * Used to add elements from a collection. You'll have a hidden "template" element with disabled inputs.
 * This template will get duplicated to create new elements
 *
 * Usage:
 *
 * <div>
 *   // Items
 *
 *   <div
 *      data-appendable="..."       | a unique name, shared among all items, used to calculate indexes for new items
 *   </div>
 *   <div
 *      data-appendable="..."
 *   </div>
 *
 *   // Hidden template item
 *
 *   <div
 *      class="hidden"              | when using this template the resulting new item will have "hidden" class removed
 *      id="..."                    | the id will be removed, when creating new items
 *      data-placeholder="..."      | this string will be replaced in names, ids and some other attributes, defaults to "{{new}}"
 *      data-appendable-label="..." | this is used to count the number of elements and to calculate the correct index number for each item),
 *                                  | the value should match that of the "data-appendable" attributes of the visible items
 *   </div>
 *
 *   <div
 *     class="btn btn-default"
 *     data-replace-index-attributes="..." | additional attributes in which to replace the __new__ value, comma separated values
 *                                         | default value is ['name', 'id', 'for', 'data-placeholder', 'data-target', 'data-appendable', 'data-appendable-label']
 *     data-add="appendable"               | designate as a button to add items
 *     data-target="..."                   | a selector for the "template" item
 *   >
 *   </div>
 *
 * </div>
 *
 * Events:
 *
 *   Triggers the "append.cl.appendable.data-api" event from the item that has just been added.
 *   relatedTarget on the event points to the template element
 *
 */

+function ($) {
    'use strict';

    var Grid = function (rects) {
        this.rects = rects;
    };

    Grid.prototype.intersect = function (rect) {
        return $.grep(this.rects, function (item) {
            return rect !== item && rect.intersect(item);
        });
    };

    Grid.prototype.compact = function () {
        var self = this;

        $.each(this.rects, function () {
            do {
                this.y -= 1;
            } while (this.y >= 0 && self.intersect(this).length === 0);

            this.y += 1;
        });

        return this;
    };

    Grid.prototype.height = function (rect, x, y) {
        var hights = $.map(
            this.rects,
            function (item) {
                return item.bottom();
            }
        );

        return hights ? Math.max.apply(null, hights) : 0;
    };

    Grid.prototype.move = function (rect, x, y) {
        var self = this;

        rect.x = x;
        rect.y = y;

        $.each(this.intersect(rect), function () {
            self.move(this, this.x, rect.bottom());
        });

        return this;
    };

    var Rect = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    };

    Rect.prototype.bottom = function () {
        return this.y + this.h;
    };

    Rect.prototype.right = function () {
        return this.x + this.w;
    };

    Rect.prototype.intersect = function (rect) {
        return this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y;
    };

    Rect.prototype.setCss = function (classes, size) {
        var self = this;

        $.each(['x', 'y', 'w', 'h'], function () {
            classes = classes.replace(new RegExp('lt-' + size + '-' + this + '-(\\d+)'), 'lt-' + size + '-' + this + '-' + self[this]);
        });

        return classes;
    };

    Rect.fromCss = function (classes, size) {
        var rect = new Rect(0, 0, 1, 1);

        $.each(['x', 'y', 'w', 'h'], function () {
            var match = classes.match(new RegExp('lt-' + size + '-' + this + '-(\\d+)'));

            if (match) {
                rect[this] = parseInt(match[1]);
            }
        });

        return rect;
    };

    $.fn.lt_rect = function (size, newRect) {
        if (undefined === newRect) {
            if (undefined === this.data('lt-item-' + size)) {
                this.data('lt-item-' + size, Rect.fromCss(this.attr('class'), size));
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
            .compact()
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

    // LAYOUT GRID DATA-API
    // ====================

    $(document)
        .on('dragstart.layout-grid.data-api', '[data-arrange="layout-grid"] .lt', function (event) {
            var $this = $(this);

            event.originalEvent.dataTransfer.setData('text/plain', 'Layout Item');

            $this.parent().lt_grid('add_ghost', $this);
        })
        .on('dragover.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            var $this = $(this);
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
