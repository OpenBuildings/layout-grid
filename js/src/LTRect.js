/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

/* exported LTRect */

var LTRect = (function ($) {

    'use strict'

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
