/* Copyright 2015 Clippings Ltd. Licensed under BSD-3-Clause
 * See license text at https://github.com/clippings/layout-grid/blob/master/LICENSE */

 /* exported LTGridOnly */

var LTGridOnly = (function ($) {

    'use strict'

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME                = 'ltGridOnly'
    var DATA_KEY            = 'lt.grid-only'
    var EVENT_KEY           = '.' + DATA_KEY

    var Event = {
        CLICK   : 'click' + EVENT_KEY
    }

    var Css = {
        xs   : 'lt-only-xs',
        sm   : 'lt-only-sm',
        md   : 'lt-only-md',
        lg   : 'lt-only-lg'
    }

    var Selector = {
        TOGGLE   : '[data-toggle="lt-grid-only"]'
    }

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    /**
     * @param  {jQuery} element
     * @param  {Object} options
     */
    function LTGridOnly(element, options) {
        this.$element = $(element)
        this.$target = $(options.target)[LTGrid.NAME]()
        this.ltGrid = this.$target.data(LTGrid.DATA_KEY)
    }

    // getters

    LTGridOnly.NAME = NAME

    LTGridOnly.DATA_KEY = DATA_KEY

    LTGridOnly.EVENT_KEY = EVENT_KEY

    // public

    /**
     * Save original params for later use
     */
    LTGridOnly.prototype.originalParams = function () {
        if (undefined === this.ltGrid.options().originalParams) {
            this.ltGrid.options().originalParams = this.ltGrid.options().params
        }

        return this.ltGrid.options().originalParams
    }

    /**
     * Compact the grid for current size
     * @param  {String} size
     */
    LTGridOnly.prototype.set = function (size) {
        var original = this.originalParams()
        var onlyClasses = $.map(
            Css,
            function (name) {
                return name
            }
        )

        this.$target.removeClass(onlyClasses.join(' '))

        if (size) {
            var params = {}
            params[size] = original[size]
            params[size].maxWidth = Number.MAX_VALUE

            this.$target.addClass(Css[size])
            this.ltGrid.option('params', params)
        } else {
            this.ltGrid.option('params', original)
        }
    }

    // static

    LTGridOnly._jQueryInterface = function (config, a1) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data(DATA_KEY)
            var _config = $.extend(
                true,
                {},
                $this.data(),
                typeof config === 'object' && config
            )

            if (!data) {
                data = new LTGridOnly(this, _config)
                $this.data(DATA_KEY, data)
            }

            if (typeof config === 'string') {
                data[config](a1)
            }
        })
    }

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document)
        .on(Event.CLICK, Selector.TOGGLE, function (event) {
            var $item = $(event.target)

            $item[LTGridOnly.NAME]('set', $item.data('only'))
        })

    /**
    * ------------------------------------------------------------------------
    * jQuery
    * ------------------------------------------------------------------------
    */

    $.fn[NAME]            = LTGridOnly._jQueryInterface
    $.fn[NAME].LTGridOnly = LTGridOnly

    return LTGridOnly

})(jQuery)
