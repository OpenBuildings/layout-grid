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

    // LAYOUT GRID CLASS DEFINITION
    // ============================

    var LayoutGrid = function (element) {
        this.$element = $(element);
        this.$element.data('params', getElementParams(this.$element))
    }

    LayoutGrid.MAX_WIDTHS = { xs: 768, sm: 992, md: 1200 }

    function currentSize () {
        var currentSize = 'lg'
        var windowWidth = $(window).width()

        $.each(LayoutGrid.MAX_WIDTHS, function (size, width) {
            if (windowWidth < width) {
                currentSize = size
            }
        })

        return currentSize
    }

    function getParams (classes) {
        var params = {
            xs: { x: 0, y: 0, w: 1, h: 1 },
            sm: { x: 0, y: 0, w: 1, h: 1 },
            md: { x: 0, y: 0, w: 1, h: 1 },
            lg: { x: 0, y: 0, w: 1, h: 1 }
        }

        $.each(params, function (key, sizeParams) {
            $.each(sizeParams, function (name) {
                params[key][name] = parseInt(classes.match(new RegExp('lt-' + key + '-' + name + '-(\\d+)'))[1])
            })
        })

        return params
    }

    function getClasses (params) {
        var classes = []

        $.each(params, function (key, sizeParams) {
            $.each(sizeParams, function (name) {
                classes.push('lt-' + key + '-' + name + '-' + params[key][name])
            })
        })

        return classes.join(' ')
    }

    function intersectRect(r1, r2) {
        return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y
    }

    function getOverlapping ($elements) {
        var overlapping = []
        var size = currentSize()

        $elements.each(function () {
            var self = $(this)

            self.siblings().each(function () {
                var r1 = self.layoutGrid().data('params')[size]
                var r2 = $(this).layoutGrid().data('params')[size]

                if (intersectRect(r1, r2)) {
                    overlapping.push(this)
                }
            })
        })

        return $(overlapping)
    }

    function clearClasses (classes) {
        return classes.replace(/lt-(xs|sm|md|lg)-(x|y|w|h)-(\d+)/g, '')
    }

    function getElementParams ($element) {
        return getParams($element.attr('class'))
    }

    function setElementParams ($element, params) {
        var classes = $element.attr('class')
        $element.attr(
            'class',
            clearClasses(classes) + ' ' + getClasses(params)
        )
    }

    LayoutGrid.prototype.dragstart = function () {
        var $ghost = $('<div class="'+this.$element.attr('class') + ' lt-ghost"></div>')
        $ghost.data('element', this.$element)

        this.$element.addClass('lt-dragged')
        this.$element.parent().append($ghost)
    }

    function moveGhost($ghost, moveX, moveY) {
        var params = getParams($ghost.attr('class'))
        var size = currentSize()

        params[size]['x'] = Math.max(0, moveX + params[size].x)
        params[size]['y'] = Math.max(0, moveY + params[size].y)

        setElementParams($ghost, params)
    }

    LayoutGrid.prototype.params = function (params) {
        this.$element.data('params', params)
        setElementParams(this.$element, params)
    }

    function dragGhost($ghost, mouseX, mouseY) {
        var x = mouseX + $(window).scrollLeft()
        var y = mouseY + $(window).scrollTop()

        var ghostLeft = parseInt($ghost.css('marginLeft'))
        var ghostRight = ghostLeft + parseInt($ghost.css('width'))

        var ghostTop = parseInt($ghost.css('marginTop'))
        var ghostBottom = ghostTop + parseInt($ghost.css('paddingBottom'))

        if (y < ghostTop) {
            moveGhost($ghost, 0, -1)
        }

        if (y > ghostBottom) {
            moveGhost($ghost, 0, +1)
        }

        if (x < ghostLeft) {
            moveGhost($ghost, -1, 0)
        }

        if (x > ghostRight) {
            moveGhost($ghost, +1, 0)
        }
    }

    LayoutGrid.prototype.dragend = function () {
        this.$element.removeClass('lt-dragged')
        this.$ghost.remove()
    }

    LayoutGrid.prototype.drop = function ($ghost) {
        var $items = this.$element.parent().children()
        var size = currentSize()

        this.$element.layoutGrid('params', getElementParams($ghost))

        $items.removeClass('lt-overlapping')
        getOverlapping($items).addClass('lt-overlapping')
    }

    // LAYOUT GRID PLUGIN DEFINITION
    // =============================

    function Plugin(option, param1, param2) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('cl.layoutGrid')

            if (!data) $this.data('cl.layoutGrid', (data = new LayoutGrid(this)))
            if (typeof option == 'string') data[option](param1, param2)
        })
    }

    $.fn.layoutGrid             = Plugin
    $.fn.layoutGrid.Constructor = LayoutGrid


    // LAYOUT GRID DATA-API
    // ====================

    $(document)
        .on('dragstart.layout-grid.data-api', '[data-arrange="layout-grid"] .lt', function (event) {
            event.originalEvent.dataTransfer.setData('text/plain', 'test')
            $(this).layoutGrid('dragstart')
        })
        .on('dragover.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault()
            dragGhost($(this).find('.lt-ghost'), event.originalEvent.clientX, event.originalEvent.clientY)
        })
        .on('dragend.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            $(this).find('.lt-ghost').remove()
            $(this).find('.lt-dragged').removeClass('lt-dragged')
        })
        .on('dragleave.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            event.preventDefault()
        })
        .on('drop.layout-grid.data-api', '[data-arrange="layout-grid"] .lt-ghost', function (event) {
            event.preventDefault()
            $(this).data('element').layoutGrid('drop', $(this))
        })

}(jQuery);
