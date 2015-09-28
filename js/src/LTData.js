/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

/* exported LTData */

var LTData = (function ($) {

    'use strict'

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
            ltGrid.grid(size, new Grid(LTData.getRects(rects)))

            return this
        }

        return ltGrid.grid(size).rects
    }

    return LTData

})(jQuery)
