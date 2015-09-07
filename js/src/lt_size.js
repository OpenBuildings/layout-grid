/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

'use strict';

(function ($) {
    /**
     * Get the current size of the grid
     */
    $.fn.lt_size = function () {
        return this.lt_grid().data(LTGrid.DATA_KEY).size()
    }

})(jQuery);
