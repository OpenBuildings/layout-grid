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

    $.lt = {
        intersectRect: function(r1, r2) {
            return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
        },

        getRectFromCss: function (classes, size) {
            var rect = { x: 0, y: 0, w: 1, h: 1 };

            $.each(rect, function (name) {
                var match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'));

                if (match) {
                    rect[name] = parseInt(match[1]);
                }
            });

            return rect;
        },

        updateCssParam: function (classes, size, name, value) {
            return classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + value);
        },

        getCssFromRect: function (classes, size, rect) {
            $.each(rect, function (name, value) {
                classes = $.lt.updateCssParam(classes, size, name, value);
            });
            return classes;
        },

        findIntersects: function (itemIndex, rects) {
            var intersected = [];
            for (var i = 0; i < rects.length; i++) {
                if (i !== itemIndex && $.lt.intersectRect(rects[i], rects[itemIndex])) {
                    intersected.push(i);
                }
            }
            return intersected;
        },

        reposition: function (itemIndex, rects) {
            var intersected = $.lt.findIntersects(itemIndex, rects);

            for (var j = 0; j < intersected.length; j++) {
                rects[intersected[j]].y = rects[itemIndex].y + rects[itemIndex].h;
                $.lt.reposition(intersected[j], rects);
            }

            return rects;
        },

        compact: function (rects) {
            var intersected;

            for (var i = 0; i < rects.length; i++) {
                do {
                    rects[i].y -= 1;
                } while (rects[i].y >= 0 && $.lt.findIntersects(i, rects).length === 0);

                rects[i].y += 1;
            }

            return rects;
        },

    };

    $.fn.lt_rect = function (size, newRect) {
        if (undefined === newRect) {
            if (undefined === this.data('lt-item-' + size)) {
                this.data('lt-item-' + size, $.lt.getRectFromCss(this.attr('class'), size));
            }
            return this.data('lt-item-' + size);
        }

        this.data('lt-item-' + size, newRect);
        this.attr('class', $.lt.getCssFromRect(this.attr('class'), size, newRect));

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
        var height = Math.max.apply(null, $.map(
            this.$element.children('[draggable]'),
            function (item) {
                var rect = $(item).lt_rect(size);
                return (rect.y + rect.h);
            }
        ));

        this.$element.attr(
            'class',
            $.lt.updateCssParam(this.$element.attr('class'), size, 'h', height)
        );
    };


    LTGrid.prototype.move_ghost = function (mouseX, mouseY) {
        var size = this.size();
        var rect = this.$ghost.lt_rect(size);
        var width = (this.$element.width() - (this.options[size].cols - 1) * this.options[size].gap) / this.options[size].cols;
        var height = width * this.options[size].aspect;

        rect.x = Math.floor(mouseX / (width + this.options[size].gap));
        rect.y = Math.floor(mouseY / (height + this.options[size].gap));

        this.$ghost.lt_rect(size, rect);
    };

    LTGrid.prototype.reposition = function (item) {
        var size = this.size();
        var $items = this.$element.children('[draggable]');

        var rects = $.map($items, function (item, index) {
            return $(item).lt_rect(size);
        });

        rects = $.lt.reposition($items.index(item), rects);
        rects = $.lt.compact(rects);

        $.each(rects, function (index) {
            $($items[index]).lt_rect(size, this);
        });

        this.resize();
    };

    LTGrid.prototype.move_dragged = function () {
        var size = this.size();
        this.$dragged.lt_rect(size, this.$ghost.lt_rect(size));

        if (false === this.overlap) {
            this.reposition(this.$dragged);
        }
    };

    LTGrid.prototype.overlapping = function ($elements) {
        var overlapping = [];

        $elements.each(function () {
            var self = $(this);

            self.siblings().each(function () {
                var r1 = self.lt_rect();
                var r2 = $(this).lt_rect();

                if ($.lt.intersectRect(r1, r2)) {
                    overlapping.push(this);
                }
            });
        });

        return $(overlapping);
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
