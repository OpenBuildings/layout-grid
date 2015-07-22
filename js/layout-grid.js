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
    }

    LayoutGrid.prototype.start = function (mouseX, mouseY) {
        this.$ghost = $('<div class="'+this.$element.attr('class') + ' lt-ghost"></div>')
        this.$element.addClass('lt-dragged')
        this.$element.parent().append(this.$ghost)
        this.mouseX = mouseX - this.$element.position().left
        this.mouseY = mouseY - this.$element.position().top

        console.log(this.$ghost)
    }

    LayoutGrid.prototype.stop = function () {
        this.$element.removeClass('lt-dragged')
        this.$ghost.remove()
    }


    // LAYOUT GRID PLUGIN DEFINITION
    // =============================

    function Plugin(option, param) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('cl.layout_grid')

            if (!data) $this.data('cl.layout_grid', (data = new LayoutGrid(this)))
            if (typeof option == 'string') data[option](param)
        })
    }

    $.fn.layout_grid             = Plugin
    $.fn.layout_grid.Constructor = LayoutGrid


    // LAYOUT GRID DATA-API
    // ====================

    $(document)
        .on('dragstart.layout-grid.data-api', '[data-arrange="layout-grid"] .lt', function (event) {
            $(this).layout_grid('start', event.originalEvent.clientX, event.originalEvent.clientY)
        })
        .on('dragover.layout-grid.data-api', '[data-arrange="layout-grid"]', function (event) {
            $(this).layout_grid('move', event.originalEvent.clientX, event.originalEvent.clientY)
        })
        .on('dragend.layout-grid.data-api', '[data-arrange="layout-grid"] .lt', function (event) {
            $(this).layout_grid('stop')
        })

}(jQuery);
