import 'lt_grid'

($ => {

    /**
     * Get the current size of the grid
     */
    $.fn.lt_size = function () {
        return this.lt_grid().data(LTGrid.DATA_KEY).size()
    }

})(jQuery);
