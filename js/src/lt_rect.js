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
     * Getter / setter for div element's rect.
     * Uses its css classes to laod the initial rect for a given size,
     * then caches in data.
     * Each screen size has its own rect
     *
     * @param  {string} size    xs, sm, md or lg
     * @param  {Rect}   newRect a Rect object to set
     * @return {jQuery}
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
  }

})(jQuery);
