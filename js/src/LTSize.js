/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

 /* exported LTSize */

var LTSize = (function ($) {

    'use strict'

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
